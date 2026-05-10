import { Router } from 'express';
import { MaintenanceTeamController } from '../controllers/maintenance-team.controller';

const router = Router();

router.get('/', MaintenanceTeamController.getAll);
router.get('/:id', MaintenanceTeamController.getById);
router.post('/', MaintenanceTeamController.create);
router.put('/:id', MaintenanceTeamController.update);
router.delete('/:id', MaintenanceTeamController.delete);

// Member management
router.post('/:id/members', MaintenanceTeamController.addMember);
router.delete('/:id/members/:userId', MaintenanceTeamController.removeMember);

export default router;
