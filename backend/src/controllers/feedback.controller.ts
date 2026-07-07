import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { name, email, type, ratings, comment, imageUrl } = req.body;

    if (!name || !email || !type || !ratings || !comment) {
      return res.status(400).json({ error: 'Missing required feedback fields' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        type,
        ratings: typeof ratings === 'object' ? JSON.stringify(ratings) : ratings,
        comment,
        imageUrl,
      },
    });

    res.status(201).json({ success: true, feedback });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ feedbacks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllFeedbacksAdmin = async (req: Request, res: Response) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ feedbacks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
