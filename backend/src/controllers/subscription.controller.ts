import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createSubscription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { productId, quantity, frequency, address, phone } = req.body;

    if (!productId || !quantity || !frequency || !address || !phone) {
      return res.status(400).json({ error: 'Missing required subscription fields' });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user.id,
        productId,
        quantity: parseInt(quantity),
        frequency,
        address,
        phone,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({ subscription });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMySubscriptions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ subscriptions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubscriptionStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    const { status } = req.body; // ACTIVE or PAUSED

    if (!status || (status !== 'ACTIVE' && status !== 'PAUSED')) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const sub = await prisma.subscription.findUnique({ where: { id } });
    if (!sub || (sub.userId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(404).json({ error: 'Subscription not found or unauthorized' });
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ subscription: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubscriptionDetails = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    const { quantity, address, phone } = req.body;

    const sub = await prisma.subscription.findUnique({ where: { id } });
    if (!sub || (sub.userId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(404).json({ error: 'Subscription not found or unauthorized' });
    }

    const updateData: any = {};
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;

    const updated = await prisma.subscription.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ subscription: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSubscriptionsAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ subscriptions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
