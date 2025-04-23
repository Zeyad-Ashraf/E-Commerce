import { createTransport } from 'nodemailer';

export const sendEmailService = async ({ to, subject, html }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: to as string,
    subject: subject as string,
    html: html as string,
  });
};
