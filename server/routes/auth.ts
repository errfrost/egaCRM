import { Router } from 'express';
import { register, login } from '../controllers/auth.js';

const router = Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Info
// router.get('/info', userInfo);

export default router;
