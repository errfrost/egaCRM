import { Router } from 'express';
import {
    addClient,
    getClients,
    getClient,
    updateClient,
} from '../controllers/clientController.js';

const router = Router();

router.post('/add', addClient); // Add new Client
router.get('/', getClients); // Get all Clients
router.get('/:clientNumber', getClient); // Get client by clientNumber
router.put('/:clientNumber', updateClient); // Update client

export default router;
