import { Router } from 'express';
import {
    getAbonements,
    getClientAbonements,
} from '../controllers/abonementController.js';

const router = Router();

router.get('/', getAbonements);
router.get('/:clientID', getClientAbonements);

export default router;
