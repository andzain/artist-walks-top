import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function notifyGuideOfBooking(data: {
  name: string;
  email: string;
  phone: string;
  experienceSlug: string;
  startsAt: Date;
}) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.NOTIFY_EMAIL,
    subject: `New booking: ${data.experienceSlug}`,
    text: `${data.name} booked "${data.experienceSlug}" for ${data.startsAt.toLocaleString()}.\nEmail: ${data.email}\nPhone: ${data.phone}`,
  });
}
export async function confirmBookingToCustomer(data: {
  name: string;
  email: string;
  experienceTitle: string;
  startsAt: Date;
  meetingPoint: string;
}) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: data.email,
    subject: `Your booking is confirmed — ${data.experienceTitle}`,
    text: `Hi ${data.name},

Your booking is confirmed.

Experience: ${data.experienceTitle}
Date & time: ${data.startsAt.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}
Meeting point: ${data.meetingPoint}

If you have any questions, reply to this email.

See you soon,
ArtistWalks
`,
  });
}
