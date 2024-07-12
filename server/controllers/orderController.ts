import { Request, Response } from 'express';
import Order from '../models/orderModel.js';
import Client from '../models/clientModel.js';

// GetOrders
export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find()
            .populate('client')
            .populate('product')
            .populate('admin')
            .exec();
        if (!orders)
            return res.status(402).json({
                message: 'Продаж не найдено',
            });

        return res.json({
            orders,
            message: 'Получен список продаж',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetClientOrders
export const getClientOrders = async (req: Request, res: Response) => {
    try {
        const { clientNumber } = req.params;
        const clientID = await Client.findOne({ clientNumber });

        if (!clientID)
            return res.status(402).json({
                message: 'Клиент не найден',
            });

        const orders = await Order.find({ client: clientID })
            .populate('client')
            .populate('product')
            .populate('admin')
            .exec();
        if (!orders)
            return res.status(402).json({
                message: 'Покупок не найдено',
            });

        return res.json({
            orders,
            message: 'Получен список покупок клиента',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
