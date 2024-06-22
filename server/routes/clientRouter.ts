import { Router } from 'express';
import {
    addClient,
    getClients,
    getClient,
} from '../controllers/clientController.js';

const router = Router();

// Add new Client
router.post('/add', addClient);
router.get('/get', getClients);
router.get('/get/:clientNumber', getClient);

export default router;
