import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', CommunityController.list);
router.get('/:id', CommunityController.getById);

// Authenticated
router.post('/', authenticate, CommunityController.create);
router.delete('/:id', authenticate, CommunityController.delete);

export default router;
