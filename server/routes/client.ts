import { Router } from 'express';
import { addClient } from '../controllers/client.js';

const router = Router();

// Add new Client
router.post('/add', addClient);

export default router;
