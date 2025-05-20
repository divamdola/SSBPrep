const nodemailer=require('nodemailer');

const sendEmail=async options=>{
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "592e7c4fe21b8e",
          pass: "19dd0b4c339922"
        }
      });

      const message={
        from:`${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
      }

      await transporter.sendMail(message);
}

module.exports=sendEmail;
