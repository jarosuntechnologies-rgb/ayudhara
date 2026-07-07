import { Router } from 'express';
import { submitFeedback, getPublicFeedbacks, getAllFeedbacksAdmin } from '../controllers/feedback.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', submitFeedback);
router.get('/public', getPublicFeedbacks);
router.get('/admin', authenticateToken, requireAdmin, getAllFeedbacksAdmin);

export default router;
