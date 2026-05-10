import { Router } from 'express';
import { NoteController } from '../controllers/note.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/trip/:tripId', NoteController.listByTrip);
router.get('/:id', NoteController.getById);
router.post('/', NoteController.create);
router.patch('/:id', NoteController.update);
router.delete('/:id', NoteController.delete);

export default router;
