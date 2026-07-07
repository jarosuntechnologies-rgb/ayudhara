import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import subscriptionRoutes from './routes/subscription.routes';
import vendingRoutes from './routes/vending.routes';
import leadRoutes from './routes/lead.routes';
import feedbackRoutes from './routes/feedback.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/vending-machines', vendingRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/feedback', feedbackRoutes);

// Welcome / Status Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'AYUDHARA Dairy API',
    status: 'ACTIVE',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      subscriptions: '/api/subscriptions',
      vending: '/api/vending-machines',
      leads: '/api/leads',
      feedback: '/api/feedback'
    }
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
