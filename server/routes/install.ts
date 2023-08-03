import { Router } from 'express';
import { install } from '../controllers/install.js';

const router = Router();

// Install DB
router.post('', install);

export default router;
