import dotenv from 'dotenv';
dotenv.config();

import app from './app';

// For Vercel serverless deployment — export the Express app directly
export default app;
