import { Router } from 'express';
import {
    getClientOrders,
    getOrders,
    updateClientOrder,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders); // Get all Categories
router.get('/:clientID', getClientOrders); // Get orders by clientNumber
router.put('/:orderID', updateClientOrder); // update order

export default router;
