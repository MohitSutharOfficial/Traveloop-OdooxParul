import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Load env before anything else
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import tripRoutes from './routes/trip.routes';
import destinationRoutes from './routes/destination.routes';
import itineraryRoutes from './routes/itinerary.routes';
import activityRoutes from './routes/activity.routes';
import packingRoutes from './routes/packing.routes';
import noteRoutes from './routes/note.routes';
import invoiceRoutes from './routes/invoice.routes';
import communityRoutes from './routes/community.routes';
import adminRoutes from './routes/admin.routes';

import { appConfig } from './config/app';

const app: Application = express();

// ─── Security ────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: appConfig.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Logging ─────────────────────────────────────────────
if (appConfig.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Body parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Traveloop API is running',
    timestamp: new Date().toISOString(),
    environment: appConfig.nodeEnv,
    version: appConfig.apiVersion,
  });
});

// ─── API routes ──────────────────────────────────────────
const prefix = `/api/${appConfig.apiVersion}`;

app.use(`${prefix}/auth`, authRoutes);
app.use(`${prefix}/profiles`, profileRoutes);
app.use(`${prefix}/trips`, tripRoutes);
app.use(`${prefix}/destinations`, destinationRoutes);
app.use(`${prefix}/itinerary`, itineraryRoutes);
app.use(`${prefix}/activities`, activityRoutes);
app.use(`${prefix}/packing`, packingRoutes);
app.use(`${prefix}/notes`, noteRoutes);
app.use(`${prefix}/invoices`, invoiceRoutes);
app.use(`${prefix}/community`, communityRoutes);
app.use(`${prefix}/admin`, adminRoutes);

// ─── 404 ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// ─── Global error handler ────────────────────────────────
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: appConfig.isProd ? 'Internal server error' : err.message || 'Internal server error',
    },
  });
});

export default app;
