import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendVerifyMail = async (name, email, id) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
        <h2 style="color: #333;">Email Verification</h2>
        <p style="font-size: 16px; color: #555;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 16px; color: #555;">Please click the button below to verify your email:</p>
        <a href="http://localhost:3000/verify?id=${id}" 
           style="display: inline-block; padding: 12px 20px; margin: 10px 0; font-size: 16px; font-weight: bold; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
           Verify Email
        </a>
        <p style="font-size: 14px; color: #777;">If you didn’t request this verification, you can safely ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #aaa;">&copy; 2025 Your Company Name. All rights reserved.</p>
      </div>
    `,
  }

  transporter.sendMail(mailOptions, (err, info)=> {
    if(err){
        console.log('Error ocuured in the mail .send Mail method' ,err);
    }

    else{
        console.log('Email has been successfully sent', info.response)
    }
  })  
};

export default sendVerifyMail;
