import { Router } from 'express';
import { register, login, getAdmin } from '../controllers/authController.js';

const router = Router();

router.post('/register', register); // Register
router.post('/login', login); // Login
router.get('/:adminID', getAdmin); // Get admin by objectID

export default router;
