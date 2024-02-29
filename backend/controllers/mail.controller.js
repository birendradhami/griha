
import sendEmail from '../utils/sendEmail.js';

export const sendApprovalEmail = async (req, res, next) => {
  try {
    const { to: userEmail, subject, text } = req.body;

    await sendEmail(userEmail, subject, text);

    res.status(200).json({ success: true, message: 'Approval email sent successfully.' });
  } catch (error) {
    console.error('Error sending approval email:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const sendDenialEmail = async (req, res, next) => {
  try {
    const { to: userEmail, subject, text } = req.body;

    await sendEmail(userEmail, subject, text);

    res.status(200).json({ success: true, message: 'Denial email sent successfully.' });
  } catch (error) {
    console.error('Error sending denial email:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
