import { Router } from 'express';
import { PackingController } from '../controllers/packing.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/trip/:tripId', PackingController.listByTrip);
router.post('/', PackingController.create);
router.post('/bulk', PackingController.bulkCreate);
router.patch('/:id', PackingController.update);
router.patch('/:id/toggle', PackingController.togglePacked);
router.delete('/:id', PackingController.delete);

export default router;
