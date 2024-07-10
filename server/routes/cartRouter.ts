import { Router } from 'express';
import { sellProduct2Client } from '../controllers/cartController.js';

const router = Router();

router.post('/sell', sellProduct2Client); // SellProduct

export default router;
