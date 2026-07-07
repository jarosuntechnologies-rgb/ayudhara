import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const submitCommunityOrder = async (req: Request, res: Response) => {
  try {
    const { apartmentName, location, families, quantity, preferredTime, contactName, phone, email, notes } = req.body;

    if (!apartmentName || !location || !families || !quantity || !preferredTime || !contactName || !phone || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const order = await prisma.communityOrder.create({
      data: {
        apartmentName,
        location,
        families: parseInt(families),
        quantity: parseFloat(quantity),
        preferredTime,
        contactName,
        phone,
        email,
        notes,
        status: 'PENDING',
      },
    });

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const submitBulkOrder = async (req: Request, res: Response) => {
  try {
    const { businessName, gstNumber, contactName, phone, email, products, quantity, frequency, address, expectedDate } = req.body;

    if (!businessName || !contactName || !phone || !email || !products || !quantity || !frequency || !address || !expectedDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const order = await prisma.bulkOrder.create({
      data: {
        businessName,
        gstNumber,
        contactName,
        phone,
        email,
        products: typeof products === 'object' ? JSON.stringify(products) : products,
        quantity: parseInt(quantity),
        frequency,
        address,
        expectedDate: new Date(expectedDate),
        status: 'PENDING',
      },
    });

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommunityOrdersAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.communityOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBulkOrdersAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.bulkOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCommunityOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.communityOrder.update({
      where: { id },
      data: { status },
    });
    res.status(200).json({ order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBulkOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.bulkOrder.update({
      where: { id },
      data: { status },
    });
    res.status(200).json({ order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
