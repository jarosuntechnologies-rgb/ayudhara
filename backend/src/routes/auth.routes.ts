import { Router } from 'express';
import { register, login, googleLogin, getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/profile', authenticateToken, getProfile);

export default router;
