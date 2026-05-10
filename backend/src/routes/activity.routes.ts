import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', ActivityController.list);
router.get('/:id', ActivityController.getById);

// Authenticated
router.post('/', authenticate, ActivityController.create);
router.delete('/:id', authenticate, ActivityController.delete);

export default router;
