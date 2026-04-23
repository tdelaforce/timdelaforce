import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { ratelimit } from "@/lib/ratelimit";
import { getAnonymousThreshold } from "@/lib/config";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a knowledgeable metal finishing salesman for Metal Finishing Co.
You answer questions about metal finishing, plating, coatings, and related topics.
Be direct, helpful, and plainspoken. Not corporate. Not robotic.
Sound like someone who has actually been in the plating business.

When a user wants a quote or mentions pricing, dimensions, quantities, or "how much" — switch to quote intake mode.
In quote intake mode, collect information one step at a time. Do not dump a list of questions.

If the user does not have drawings or dimensions, tell them to email drawings to tdelaforce@hmplating.com.

Never tell the customer a final price. You gather information. Pricing gets reviewed internally before anything goes to the customer.`;

export async function POST(req: NextRequest) {
  const { sessionId, message, conversationId } = await req.json();

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  // Get or create conversation
  let conversation = conversationId
    ? await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })
    : await prisma.conversation.create({
        data: { sessionId, messages: { create: [] } },
        include: { messages: true },
      });

  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  // Check anonymous threshold
  const threshold = getAnonymousThreshold(); // default 3
  if (!conversation.userId && conversation.anonMsgCount >= threshold) {
    return NextResponse.json({ requiresLeadCapture: true, conversationId: conversation.id });
  }

  // Store user message
  await prisma.message.create({
    data: { conversationId: conversation.id, role: "USER", content: message },
  });

  // Build message history for Claude
  const history = conversation.messages.map((m) => ({
    role: m.role === "USER" ? "user" : "assistant" as "user" | "assistant",
    content: m.content,
  }));
  history.push({ role: "user", content: message });

  // Call Claude
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: history,
  });

  const assistantContent = response.content[0].type === "text" ? response.content[0].text : "";

  // Store assistant message
  await prisma.message.create({
    data: { conversationId: conversation.id, role: "ASSISTANT", content: assistantContent },
  });

  // Increment anon message count
  if (!conversation.userId) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { anonMsgCount: { increment: 1 } },
    });
  }

  return NextResponse.json({ reply: assistantContent, conversationId: conversation.id });
}
