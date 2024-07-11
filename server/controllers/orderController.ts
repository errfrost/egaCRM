import { Request, Response } from 'express';
import Order from '../models/orderModel.js';

// GetProducts
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

// GetOrder
export const getOrder = async (req: Request, res: Response) => {
    try {
        return res.json({
            message: 'Товар найден',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
