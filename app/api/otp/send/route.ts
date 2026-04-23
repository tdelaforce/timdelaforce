import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSmsOtp, sendEmailOtp } from "@/lib/notifications";
import { addMinutes } from "date-fns";
import { randomInt } from "crypto";

export async function POST(req: NextRequest) {
  const { userId, method } = await req.json(); // method: "EMAIL" | "SMS"

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const code = randomInt(100000, 999999).toString();
  const expiresAt = addMinutes(new Date(), 10);

  await prisma.otpCode.create({
    data: { userId, code, method, expiresAt },
  });

  if (method === "SMS" && user.phone) {
    await sendSmsOtp(user.phone, code);
  } else if (method === "EMAIL" && user.email) {
    await sendEmailOtp(user.email, code);
  } else {
    return NextResponse.json({ error: "No contact info for selected method" }, { status: 400 });
  }

  return NextResponse.json({ sent: true });
}
