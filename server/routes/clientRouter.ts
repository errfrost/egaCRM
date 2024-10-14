import { Router } from 'express';
import {
    addClient,
    getClients,
    getClient,
    updateClient,
    findClients,
    getClientVisitLogs,
} from '../controllers/clientController.js';
import {
    addClientType,
    getClientTypes,
    updateClientType,
} from '../controllers/clientTypeController.js';

const router = Router();

router.post('/add', addClient); // Add new Client
router.post('/find', findClients); // find Clients by searchText
router.get('/visits/:clientID', getClientVisitLogs); // Get client visit logs
router.get('/types', getClientTypes);
router.post('/types', addClientType);
router.put('/types/:clientTypeID', updateClientType);
router.get('/', getClients); // Get all Clients
router.get('/:clientID', getClient); // Get client by clientNumber
router.put('/:clientID', updateClient); // Update client

export default router;
