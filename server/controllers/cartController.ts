import { Request, Response } from 'express';
import Order from '../models/orderModel.js';
import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';
import Product from '../models/productModel.js';

// SellProduct при условии передачи корзины поэлементно
export const sellProduct2Client = async (req: Request, res: Response) => {
    try {
        const { clientNumber, productID, productPrice, count, admin } =
            req.body;
        const summ = productPrice * count;
        const adminID = await Admin.findOne({ username: admin });
        const client = await Client.findOne({ clientNumber });
        const product = await Product.findById(productID);

        // проверить есть ли такое количество товара
        if (!product)
            return res.status(402).json({
                message: 'Товар не найден',
            });

        if (!product.active)
            return res.status(400).json({ message: 'Товар не доступен' });
        if (product.count - count < 0)
            return res
                .status(400)
                .json({ message: 'Недостаточно товара на складе' });

        const newOrder = new Order({
            client: client?._id,
            product: productID,
            summ,
            count,
            admin: adminID?._id,
        });

        await newOrder.save();

        // отнять количество товара из наличия
        product.count -= count;
        await product.save();

        return res.json({
            newOrder,
            message: 'Товар успешно продан',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const unsellProduct2Client = async (req: Request, res: Response) => {
    return res.status(400).json({ message: 'unsell' });
};
