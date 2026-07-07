import { Router } from 'express';
import {
  submitCommunityOrder,
  submitBulkOrder,
  getCommunityOrdersAdmin,
  getBulkOrdersAdmin,
  updateCommunityOrderStatus,
  updateBulkOrderStatus,
} from '../controllers/lead.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/community', submitCommunityOrder);
router.post('/bulk', submitBulkOrder);
router.get('/community/admin', authenticateToken, requireAdmin, getCommunityOrdersAdmin);
router.get('/bulk/admin', authenticateToken, requireAdmin, getBulkOrdersAdmin);
router.put('/community/:id/status', authenticateToken, requireAdmin, updateCommunityOrderStatus);
router.put('/bulk/:id/status', authenticateToken, requireAdmin, updateBulkOrderStatus);

export default router;
