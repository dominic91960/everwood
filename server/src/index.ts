import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

import contentRoutes from './content/routes';
import contactRoutes from './contact/routes';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://everwoodcollection.com',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to Furniture Website API' });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Example route to test Prisma connection
app.get('/api/test-db', async (_req: Request, res: Response) => {
  try {
    // This will test the database connection
    await prisma.$connect();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error });
  }
});

// Register content/blog routes
app.use('/contents', contentRoutes);

// Register contact routes
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
