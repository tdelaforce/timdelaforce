import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, code } = await req.json();

  const otp = await prisma.otpCode.findFirst({
    where: { userId, verified: false, code },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  if (new Date() > otp.expiresAt) return NextResponse.json({ error: "Code expired" }, { status: 400 });
  if (otp.attempts >= 3) return NextResponse.json({ error: "Too many attempts" }, { status: 400 });

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { verified: true },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });

  return NextResponse.json({ verified: true });
}
