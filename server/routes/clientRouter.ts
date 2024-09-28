import { Router } from 'express';
import {
    addClient,
    getClients,
    getClient,
    updateClient,
    findClients
} from '../controllers/clientController.js';

const router = Router();

router.post('/add', addClient); // Add new Client
router.post('/find', findClients); // find Clients by searchText
router.get('/', getClients); // Get all Clients
router.get('/:clientID', getClient); // Get client by clientNumber
router.put('/:clientID', updateClient); // Update client

export default router;
