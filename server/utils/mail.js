import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendOtpMail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password",
    html:`<p>Your OTP code for password reset is <b>${otp}</b>. It is valid for 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};
