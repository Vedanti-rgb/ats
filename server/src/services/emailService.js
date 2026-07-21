const nodemailer = require('nodemailer');

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

const sendShortlistEmail = async ({ candidateName, candidateEmail, jobTitle, companyName }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: candidateEmail,
    subject: "Congratulations! You've Been Shortlisted 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #10b981; text-align: center; margin-top: 0;">Congratulations!</h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 15px;">
          <p style="font-size: 16px; color: #374151;">Hello <strong>${candidateName}</strong>,</p>
          <p style="font-size: 16px; color: #374151; font-weight: bold; margin-top: 15px;">Congratulations!</p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
            You have been shortlisted for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
          </p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
            Your application has successfully passed the initial screening.
          </p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
            Please log in to your GetResume AI account to check your application status and wait for further communication from the recruiter.
          </p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-top: 20px;">
            Thank you for using GetResume AI.
          </p>
          <div style="margin-top: 25px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <p style="font-size: 14px; color: #6b7280; margin: 0;">Best Regards,</p>
            <p style="font-size: 14px; color: #374151; font-weight: bold; margin: 4px 0 0 0;">${companyName}</p>
            <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">GetResume AI Team</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    console.log(`Attempting to send shortlist email to: ${candidateEmail}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Shortlist email sent successfully. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Nodemailer error sending shortlist email:', error);
    throw error;
  }
};

module.exports = {
  sendShortlistEmail,
};
