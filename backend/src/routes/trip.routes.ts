import { Router } from 'express';
import { TripController } from '../controllers/trip.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', TripController.list);
router.get('/stats', TripController.stats);
router.get('/:id', TripController.getById);
router.post('/', TripController.create);
router.patch('/:id', TripController.update);
router.delete('/:id', TripController.delete);

export default router;
