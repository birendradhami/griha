import express from 'express';
import { sendApprovalEmail, sendDenialEmail } from '../controllers/mailController.js';

const router = express.Router();

router.post('/send-approval-email', sendApprovalEmail);
router.post('/send-denial-email', sendDenialEmail);

export default router;
