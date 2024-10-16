import { Request, Response } from 'express';
import moment from 'moment';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Client from '../models/clientModel.js';
import Abonement from '../models/abonementModel.js';
import { countUsedLessonsInAbonement } from '../utils/abonementUtils.js';

// GetNewOrderNumber
export const getNewOrderNumber = async (req: Request, res: Response) => {
    try {
        let newOrderNumber = 0;
        const lastOrderNumber = await Order.findOne().sort('-orderNumber');
        if (lastOrderNumber && lastOrderNumber.orderNumber)
            newOrderNumber = lastOrderNumber.orderNumber;
        newOrderNumber += 1;

        return res.json({
            newOrderNumber,
            message: 'Получен список продаж',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetOrders
export const getOrders = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, searchText, category, status } = req.query;

        let orders;
        if (status === 'cancel') {
            orders = await Order.find({
                updatedAt: {
                    $gte: moment(new Date(startDate)).format(
                        'YYYY-MM-DD[T00:00:00.000Z]'
                    ),
                    $lte: moment(new Date(endDate)).format(
                        'YYYY-MM-DD[T23:59:59.000Z]'
                    ),
                },
                status: 'cancel',
            })
                .populate({
                    path: 'product',
                    match: {
                        name: new RegExp(searchText, 'i'),
                        category:
                            category !== ''
                                ? category
                                : {
                                      $exists: true,
                                  },
                    },
                    populate: [
                        { path: 'category', select: 'abonement service' },
                    ],
                })
                .populate('client')
                .populate('admin')
                .exec();
        } else {
            orders = await Order.find({
                createdAt: {
                    $gte: moment(new Date(startDate)).format(
                        'YYYY-MM-DD[T00:00:00.000Z]'
                    ),
                    $lte: moment(new Date(endDate)).format(
                        'YYYY-MM-DD[T23:59:59.000Z]'
                    ),
                },
            })
                .populate({
                    path: 'product',
                    match: {
                        name: new RegExp(searchText, 'i'),
                        category:
                            category !== ''
                                ? category
                                : {
                                      $exists: true,
                                  },
                    },
                    populate: [
                        { path: 'category', select: 'abonement service' },
                    ],
                })
                .populate('client')
                .populate('admin')
                .exec();
        }

        if (!orders)
            return res.status(402).json({
                message: 'Продаж не найдено',
            });
        orders = orders.filter((order) => order.product !== null);

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
                populate: [{ path: 'category', select: 'abonement service' }],
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
        const { status, comment, returnProduct, service, abonement } = req.body;
        const order = await Order.findById(orderID)
            .populate('client')
            .populate({
                path: 'product',
                populate: [{ path: 'category', select: 'service' }],
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
