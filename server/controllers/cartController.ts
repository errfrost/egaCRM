import { Request, Response } from 'express';
import Order from '../models/orderModel.js';
import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';
import Product from '../models/productModel.js';
import ProductCategory from '../models/productCategoryModel.js';
import addAbonement from '../utils/abonementUtils.js';

// SellProduct при условии передачи корзины поэлементно
export const sellProduct2Client = async (req: Request, res: Response) => {
    try {
        const {
            clientID,
            productID,
            productPrice,
            count,
            status,
            discount,
            fullCartPaymentSum,
            paymentMethod,
            comment,
            admin,
        } = req.body;
        const summ = productPrice * count;
        const adminID = await Admin.findOne({ username: admin });
        const client = await Client.findById(clientID);
        const product = await Product.findById(productID)
            .populate('category')
            .exec();

        if (!adminID)
            return res.status(402).json({
                message: 'Админ не найден',
            });

        if (!client)
            return res.status(402).json({
                message: 'Клиент не найден',
            });

        // проверить есть ли такое количество товара
        if (!product)
            return res.status(402).json({
                message: 'Товар не найден',
            });

        if (!product.active)
            return res.status(400).json({ message: 'Товар не доступен' });
        if (!product.category.active)
            return res
                .status(400)
                .json({ message: 'Категория выбранного товара не доступна' });
        if (product.count - count < 0)
            return res
                .status(400)
                .json({ message: 'Недостаточно товара на складе' });

        const newOrder = new Order({
            client: clientID,
            product: productID,
            summ,
            count,
            status,
            discount,
            fullCartPaymentSum,
            paymentMethod,
            comment,
            admin: adminID._id,
        });

        await newOrder.save();

        // отнять количество товара из наличия
        product.count -= count;
        await product.save();

        // проверить если товар - это абонемент, то добавить в абонемент запись
        const productCategory = await ProductCategory.findOne({
            _id: product.category,
        });
        if (productCategory?.abonement) {
            addAbonement(clientID, newOrder._id, product.abonementLessonsCount);
        }

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
