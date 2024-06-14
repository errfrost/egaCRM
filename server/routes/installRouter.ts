import { Router } from 'express';
import install from '../controllers/installController.js';

const router = Router();

// Install DB
router.post('', install);

export default router;
