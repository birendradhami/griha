import nodemailer from "nodemailer";


 const sendmail = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

		await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: subject,
      text: text,
    });
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
export default sendmail;