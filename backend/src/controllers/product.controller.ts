import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, sortBy } = req.query;

    let whereClause: any = {};

    if (category && category !== 'All') {
      whereClause.category = {
        equals: category as string,
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    let orderByClause: any = {};
    if (sortBy === 'price_asc') {
      orderByClause = { price: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderByClause = { price: 'desc' };
    } else {
      orderByClause = { createdAt: 'desc' };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
    });

    res.status(200).json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, stock, imageUrl, sizes, nutrition } = req.body;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        sizes,
        nutrition: typeof nutrition === 'object' ? JSON.stringify(nutrition) : nutrition,
      },
    });

    res.status(201).json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, price, stock, imageUrl, sizes, nutrition } = req.body;

    const updatedData: any = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (category) updatedData.category = category;
    if (price) updatedData.price = parseFloat(price);
    if (stock !== undefined) updatedData.stock = parseInt(stock);
    if (imageUrl) updatedData.imageUrl = imageUrl;
    if (sizes) updatedData.sizes = sizes;
    if (nutrition) updatedData.nutrition = typeof nutrition === 'object' ? JSON.stringify(nutrition) : nutrition;

    const product = await prisma.product.update({
      where: { id },
      data: updatedData,
    });

    res.status(200).json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
