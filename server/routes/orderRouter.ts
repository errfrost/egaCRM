import { Router } from 'express';
import { getClientOrders, getOrders } from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders); // Get all Categories
router.get('/:clientID', getClientOrders); // Get orders by clientNumber

export default router;
