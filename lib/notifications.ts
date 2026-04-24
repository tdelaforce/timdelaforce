import twilio from "twilio";
import { Resend } from "resend";

export async function sendSmsOtp(phone: string, code: string) {
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await twilioClient.messages.create({
    body: `Your Metal Finishing Co verification code is: ${code}. Expires in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}

export async function sendEmailOtp(email: string, code: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Metal Finishing Co <noreply@yourcompany.com>",
    to: email,
    subject: "Your verification code",
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>Expires in 10 minutes.</p>`,
  });
}

export async function notifyAdminNewQuote(quoteRequestId: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Metal Finishing Co Bot <noreply@yourcompany.com>",
    to: "tdelaforce@hmplating.com",
    subject: "New quote request ready for review",
    html: `<p>A new quote request is ready for review.</p>
           <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/quotes/${quoteRequestId}">Review it here</a></p>`,
  });
}
