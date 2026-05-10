import { Router } from 'express';
import { ItineraryController } from '../controllers/itinerary.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/trip/:tripId', ItineraryController.listByTrip);
router.get('/:id', ItineraryController.getById);
router.post('/', ItineraryController.create);
router.patch('/:id', ItineraryController.update);
router.delete('/:id', ItineraryController.delete);
router.post('/reorder', ItineraryController.reorder);

export default router;
