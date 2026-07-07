import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.feedback.deleteMany();
  await prisma.vendingMachine.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // Create Users (including an Admin)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@dairy.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'john@gmail.com',
      password: customerPassword,
      name: 'John Doe',
      role: 'CUSTOMER',
    },
  });

  console.log('Seeded Users: admin@dairy.com & john@gmail.com');

  // Seed Products
  const products = [
    {
      title: 'Premium A2 Desi Cow Milk',
      description: 'Single-source, unprocessed A2 milk from grass-fed Gir cows. Delivered fresh within 4 hours of milking. Rich in proteins and easy to digest.',
      category: 'Milk',
      price: 95.0,
      stock: 500,
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
      sizes: '500ml, 1L',
      nutrition: JSON.stringify({
        energy: '65 kcal',
        fat: '3.6g',
        protein: '3.2g',
        carbs: '4.8g',
        calcium: '120mg'
      })
    },
    {
      title: 'Farm Fresh Buffalo Milk',
      description: 'Thick, creamy, and high-fat milk from elite Murrah buffaloes. Perfect for making homemade curd, paneer, and rich tea or coffee.',
      category: 'Milk',
      price: 110.0,
      stock: 400,
      imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800',
      sizes: '1L, 2L',
      nutrition: JSON.stringify({
        energy: '97 kcal',
        fat: '6.5g',
        protein: '3.8g',
        carbs: '5.2g',
        calcium: '180mg'
      })
    },
    {
      title: 'Classic Set Curd (Dahi)',
      description: 'Naturally set curd with a rich texture and thick consistency. Made using active lactic cultures. A natural probiotic boost.',
      category: 'Curd',
      price: 45.0,
      stock: 300,
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
      sizes: '200g, 500g',
      nutrition: JSON.stringify({
        energy: '60 kcal',
        fat: '3.1g',
        protein: '3.3g',
        carbs: '4.5g',
        calcium: '130mg'
      })
    },
    {
      title: 'Premium Organic Paneer',
      description: 'Freshly prepared soft cottage cheese made by curdling pure cow milk. High in protein, low in sodium, with zero added preservatives.',
      category: 'Paneer',
      price: 120.0,
      stock: 250,
      imageUrl: 'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?auto=format&fit=crop&q=80&w=800',
      sizes: '200g, 500g',
      nutrition: JSON.stringify({
        energy: '265 kcal',
        fat: '20.0g',
        protein: '18.5g',
        carbs: '1.2g',
        calcium: '480mg'
      })
    },
    {
      title: 'Artisanal White Butter (Makhan)',
      description: 'Slow-churned, traditional unsalted butter with a soft, melt-in-the-mouth texture. Reminiscent of traditional countryside dairy.',
      category: 'Butter',
      price: 85.0,
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800',
      sizes: '100g, 250g',
      nutrition: JSON.stringify({
        energy: '720 kcal',
        fat: '81.0g',
        protein: '0.8g',
        carbs: '0.6g',
        calcium: '20mg'
      })
    },
    {
      title: 'Pure A2 Cow Ghee',
      description: 'Golden, granular ghee processed using the ancient Vedic Bilona method. Rich aroma, highly nutritious, and loaded with healthy fats.',
      category: 'Ghee',
      price: 650.0,
      stock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1629978431853-38827fa66885?auto=format&fit=crop&q=80&w=800',
      sizes: '500ml, 1L',
      nutrition: JSON.stringify({
        energy: '897 kcal',
        fat: '99.7g',
        protein: '0.0g',
        carbs: '0.0g',
        calcium: '0mg'
      })
    },
    {
      title: 'Creamy Vanilla Ice Cream',
      description: 'Indulgently rich, premium ice cream crafted using real dairy cream and natural vanilla beans. Silky smooth texture.',
      category: 'Ice Cream',
      price: 150.0,
      stock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=800',
      sizes: '500ml',
      nutrition: JSON.stringify({
        energy: '207 kcal',
        fat: '11.0g',
        protein: '3.5g',
        carbs: '24.0g',
        calcium: '105mg'
      })
    },
    {
      title: 'Greek Yogurt (Blueberry)',
      description: 'Strained probiotic yogurt blended with wild blueberries. High in protein, low in fat, and exceptionally creamy.',
      category: 'Yogurt',
      price: 80.0,
      stock: 300,
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
      sizes: '150g',
      nutrition: JSON.stringify({
        energy: '95 kcal',
        fat: '2.5g',
        protein: '9.0g',
        carbs: '10.0g',
        calcium: '110mg'
      })
    }
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: prod,
    });
  }

  console.log('Seeded Products');

  // Seed Vending Machines
  const locations = [
    {
      name: 'Skyline Premium Apartments - Block A',
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Skyline Towers, Lavelle Road, Bangalore',
      status: 'ACTIVE',
      stock: JSON.stringify({
        'Premium A2 Desi Cow Milk 1L': 45,
        'Farm Fresh Buffalo Milk 1L': 30,
        'Classic Set Curd 500g': 15,
        'Premium Organic Paneer 200g': 12
      })
    },
    {
      name: 'Greenwood Heights Gated Community',
      latitude: 12.9592,
      longitude: 77.6974,
      address: 'Outer Ring Road, Marathahalli, Bangalore',
      status: 'ACTIVE',
      stock: JSON.stringify({
        'Premium A2 Desi Cow Milk 1L': 60,
        'Farm Fresh Buffalo Milk 1L': 20,
        'Classic Set Curd 500g': 10
      })
    },
    {
      name: 'Prestige Boulevard Mall - Basement 1',
      latitude: 12.9822,
      longitude: 77.7483,
      address: 'Whitefield Main Road, Bangalore',
      status: 'MAINTENANCE',
      stock: JSON.stringify({
        'Premium A2 Desi Cow Milk 1L': 0,
        'Farm Fresh Buffalo Milk 1L': 0,
        'Classic Set Curd 500g': 0
      })
    }
  ];

  for (const loc of locations) {
    await prisma.vendingMachine.create({
      data: loc,
    });
  }

  console.log('Seeded Vending Machines');

  // Seed Reviews/Feedback
  const feedbacks = [
    {
      name: 'Sarah Jenkins',
      email: 'sarah.j@outlook.com',
      type: 'DELIVERY',
      ratings: JSON.stringify({ overall: 5, quality: 5, packaging: 5, delivery: 5 }),
      comment: 'Absolutely love the A2 cow milk! It arrives exactly at 6:00 AM every single morning right outside my door. The glass bottle packaging is very premium and environment friendly.',
    },
    {
      name: 'Chef David Miller',
      email: 'david@finedining.com',
      type: 'PRODUCT',
      ratings: JSON.stringify({ overall: 5, quality: 5, packaging: 4, delivery: 5 }),
      comment: 'We use their organic paneer and farm fresh buffalo milk for our restaurant. The texture of the paneer is outstandingly soft and our guests consistently compliment the rich taste.',
    },
    {
      name: 'Aditya Sen',
      email: 'aditya.sen@gmail.com',
      type: 'WEB',
      ratings: JSON.stringify({ overall: 4, quality: 5, packaging: 5, delivery: 4 }),
      comment: 'The subscription interface is so simple to use! I can easily pause my daily milk delivery whenever I am traveling.',
    }
  ];

  for (const fb of feedbacks) {
    await prisma.feedback.create({
      data: fb,
    });
  }

  console.log('Seeded Feedbacks/Reviews');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
