import { Router } from 'express';
import {
    getAbonements,
    getClientAbonements,
    updateClientAbonement,
} from '../controllers/abonementController.js';

const router = Router();

router.get('/', getAbonements);
router.get('/:clientID', getClientAbonements);
router.put('/:abonementID', updateClientAbonement); // update order

export default router;
