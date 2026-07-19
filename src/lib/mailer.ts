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
