import { Router } from 'express';
import { addClient, getClients } from '../controllers/clientController.js';

const router = Router();

// Add new Client
router.post('/add', addClient);
router.get('/get', getClients);

export default router;
