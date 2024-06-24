import { Router } from 'express';
import {
    addClient,
    getClients,
    getClient,
    updateClient,
} from '../controllers/clientController.js';

const router = Router();

// Add new Client
router.post('/add', addClient);
router.get('/', getClients);
router.get('/:clientNumber', getClient);
router.put('/:clientNumber', updateClient);

export default router;
