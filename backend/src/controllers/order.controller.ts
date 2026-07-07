import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, total, address, phone, notes } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!items || !total || !address || !phone) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    // Mock Razorpay Order ID creation
    const razorpayOrderId = 'order_mock_' + Math.random().toString(36).substr(2, 9);

    const order = await prisma.order.create({
      data: {
        userId,
        items: typeof items === 'object' ? JSON.stringify(items) : items,
        total: parseFloat(total),
        address,
        phone,
        notes,
        razorpayOrderId,
        status: 'PENDING'
      }
    });

    res.status(201).json({ order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, razorpayPaymentId } = req.body;

    if (!orderId || !razorpayPaymentId) {
      return res.status(400).json({ error: 'Order ID and Payment ID are required' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        razorpayPaymentId
      }
    });

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrdersAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status is required' });

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
