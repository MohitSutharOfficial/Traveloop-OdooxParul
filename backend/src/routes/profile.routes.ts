import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticate, ProfileController.getMe);
router.patch('/me', authenticate, ProfileController.updateMe);
router.get('/', authenticate, ProfileController.list);

export default router;
