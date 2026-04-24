import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactMethod } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, companyName, phone, email, preferredContact, conversationId } = body;

  if (!fullName || !companyName || !phone || !email || !preferredContact || !conversationId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const contactMethod = String(preferredContact).toUpperCase() as ContactMethod;
  if (contactMethod !== "EMAIL" && contactMethod !== "SMS") {
    return NextResponse.json(
      { error: "preferredContact must be EMAIL or SMS" },
      { status: 400 }
    );
  }

  // Company has no unique constraint on name, so findFirst then create.
  let company = await prisma.company.findFirst({ where: { name: companyName } });
  if (!company) {
    company = await prisma.company.create({ data: { name: companyName } });
  }

  // User.email is @unique — safe to upsert.
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      fullName,
      phone,
      preferredContact: contactMethod,
      companyId: company.id,
    },
    update: {
      fullName,
      phone,
      preferredContact: contactMethod,
      companyId: company.id,
    },
  });

  // Link user to the anonymous conversation via Conversation.userId FK.
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { userId: user.id },
  });

  return NextResponse.json({ user });
}
