import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/trip/:tripId', InvoiceController.listByTrip);
router.get('/:id', InvoiceController.getById);
router.post('/', InvoiceController.create);
router.patch('/:id', InvoiceController.update);
router.delete('/:id', InvoiceController.delete);

// Invoice items
router.post('/:id/items', InvoiceController.addItem);
router.delete('/:id/items/:itemId', InvoiceController.removeItem);

export default router;
