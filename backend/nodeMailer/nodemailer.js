import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nexus.bank.org@gmail.com",
    pass: "jfxaxtmlbhplmvwe",
  },
});

export default transporter;
