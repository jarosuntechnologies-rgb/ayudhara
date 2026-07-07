import { Router } from 'express';
import { getAllMachines, getMachineById, createMachine, updateMachine, deleteMachine } from '../controllers/vending.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllMachines);
router.get('/:id', getMachineById);
router.post('/', authenticateToken, requireAdmin, createMachine);
router.put('/:id', authenticateToken, requireAdmin, updateMachine);
router.delete('/:id', authenticateToken, requireAdmin, deleteMachine);

export default router;
