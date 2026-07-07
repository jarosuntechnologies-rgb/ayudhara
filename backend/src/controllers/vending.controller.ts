import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMachines = async (req: Request, res: Response) => {
  try {
    const machines = await prisma.vendingMachine.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ machines });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMachineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const machine = await prisma.vendingMachine.findUnique({
      where: { id },
    });

    if (!machine) {
      return res.status(404).json({ error: 'Vending machine not found' });
    }

    res.status(200).json({ machine });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMachine = async (req: Request, res: Response) => {
  try {
    const { name, latitude, longitude, address, status, stock } = req.body;

    const machine = await prisma.vendingMachine.create({
      data: {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        status: status || 'ACTIVE',
        stock: typeof stock === 'object' ? JSON.stringify(stock) : stock || '{}',
      },
    });

    res.status(201).json({ machine });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMachine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude, address, status, stock } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (latitude) updateData.latitude = parseFloat(latitude);
    if (longitude) updateData.longitude = parseFloat(longitude);
    if (address) updateData.address = address;
    if (status) updateData.status = status;
    if (stock) updateData.stock = typeof stock === 'object' ? JSON.stringify(stock) : stock;
    updateData.lastRefilled = new Date();

    const machine = await prisma.vendingMachine.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ machine });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMachine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.vendingMachine.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Machine deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
