import { Router } from 'express';
import {
    getClientOrders,
    getNewOrderNumber,
    getOrders,
    updateClientOrder,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders); // Get all Categories
router.get('/ordernumber', getNewOrderNumber); // Get new order number
router.get('/:clientID', getClientOrders); // Get orders by clientNumber
router.put('/:orderID', updateClientOrder); // update order

export default router;
