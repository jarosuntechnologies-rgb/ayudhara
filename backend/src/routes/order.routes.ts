import { Router } from 'express';
import { createOrder, verifyPayment, getMyOrders, getAllOrdersAdmin, updateOrderStatus } from '../controllers/order.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, createOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/admin', authenticateToken, requireAdmin, getAllOrdersAdmin);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;
