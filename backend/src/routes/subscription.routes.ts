import { Router } from 'express';
import {
  createSubscription,
  getMySubscriptions,
  updateSubscriptionStatus,
  updateSubscriptionDetails,
  getAllSubscriptionsAdmin,
} from '../controllers/subscription.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, createSubscription);
router.get('/my-subscriptions', authenticateToken, getMySubscriptions);
router.put('/:id/status', authenticateToken, updateSubscriptionStatus);
router.put('/:id/details', authenticateToken, updateSubscriptionDetails);
router.get('/admin', authenticateToken, requireAdmin, getAllSubscriptionsAdmin);

export default router;
