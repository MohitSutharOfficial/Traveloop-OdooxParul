import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import app from './app';
import { testConnection } from './config/supabase';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  // Test Supabase connectivity
  const connected = await testConnection();
  if (!connected) {
    logger.warn('⚠️  Supabase connection test failed — API will start but DB queries may fail');
  }

  const server = app.listen(PORT, () => {
    logger.info(`✅ Traveloop API running on http://localhost:${PORT}`);
    logger.info(`✅ Health: http://localhost:${PORT}/health`);
    logger.info(`✅ API v1: http://localhost:${PORT}/api/v1`);
    logger.info(`✅ Env: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Fatal startup error:', err);
  process.exit(1);
});
