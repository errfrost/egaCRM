import { Request, Response } from 'express';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Client from '../models/clientModel.js';
import Abonement from '../models/abonementModel.js';
import { countUsedLessonsInAbonement } from '../utils/abonementUtils.js';

// GetOrders
export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find()
            .populate('client')
            // .populate('product')
            .populate({
                path: 'product',
                populate: [{ path: 'category', select: 'abonement' }],
            })
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
        const { clientID } = req.params;
        const client = await Client.findById(clientID);

        if (!client)
            return res.status(402).json({
                message: 'Клиент не найден',
            });

        const orders = await Order.find({ client: clientID })
            .populate('client')
            // .populate('product')
            .populate({
                path: 'product',
                populate: [{ path: 'category', select: 'abonement' }],
            })
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

// UpdateClientOrder
export const updateClientOrder = async (req: Request, res: Response) => {
    try {
        const { orderID } = req.params;
        const { status, comment, returnProduct, abonement } = req.body;
        const order = await Order.findById(orderID)
            .populate('client')
            // .populate('product')
            .populate({
                path: 'product',
                populate: [{ path: 'category', select: 'abonement' }],
            })
            .populate('admin')
            .exec();

        if (!order)
            return res.status(402).json({
                message: 'Продажа не найдена',
            });

        if (status === 'cancel' && returnProduct) {
            const product = await Product.findById(order.product);
            if (product) {
                product.count += 1;
                await product.save();
            }
        }

        if (status === 'cancel' && abonement) {
            const abonement = await Abonement.find({ order: orderID });
            if (abonement) {
                const usedLessonsCount = await countUsedLessonsInAbonement(
                    abonement._id
                );
                if (usedLessonsCount === 0) {
                    await Abonement.deleteOne({ order: orderID });
                } else {
                    return res.json({
                        message: 'Нельзя отменить использованный абонемент',
                    });
                }
            }
        }

        order.status = status;
        order.comment = comment;

        await order.save();
        return res.json({
            order,
            message: 'Внесены изменения в продажу',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
