import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tuemail@gmail.com",
      pass: "tu-contraseña-app"
    }
  });

  await transporter.sendMail({
    from: '"ZenMediClick" <no-reply@zenmediclick.com>',
    to,
    subject,
    text
  });
};
