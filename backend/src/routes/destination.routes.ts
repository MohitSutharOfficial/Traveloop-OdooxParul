import { Router } from 'express';
import { DestinationController } from '../controllers/destination.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', DestinationController.list);
router.get('/:id', DestinationController.getById);

// Admin routes (authenticated)
router.post('/', authenticate, DestinationController.create);
router.patch('/:id', authenticate, DestinationController.update);
router.delete('/:id', authenticate, DestinationController.delete);

export default router;
