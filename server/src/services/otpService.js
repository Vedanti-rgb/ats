const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateOTP = () => {
  return crypto.randomInt(1000, 9999).toString();
};

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
    tls: {
      rejectUnauthorized: true,
    },
  });
};

const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'GetResumeAI - Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f97316; text-align: center;">GetResumeAI</h2>
        <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h3 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h3>
          <p style="color: #666; margin-bottom: 20px;">Your verification code is:</p>
          <div style="background: #fff; padding: 20px; text-align: center; border-radius: 8px; border: 2px dashed #f97316; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316;">${otp}</span>
          </div>
          <p style="color: #999; font-size: 12px;">This code will expire in 10 minutes.</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    console.log('Attempting to send OTP email to:', email);
    console.log('Using email account:', process.env.EMAIL_USER);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
};

module.exports = { generateOTP, sendOTPEmail };
