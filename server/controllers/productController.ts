import { Request, Response } from 'express';
import Product from '../models/productModel.js';

// AddProduct
export const addProduct = async (req: Request, res: Response) => {
    try {
        const {
            name,
            category,
            price,
            description,
            count,
            abonementLessonsCount,
        } = req.body;

        const isUsed = await Product.findOne({ name });
        if (isUsed)
            return res.status(402).json({
                message: 'Товар с таким именем уже существует',
            });

        const newProduct = new Product({
            name,
            category,
            price,
            description,
            count,
            abonementLessonsCount,
        });

        await newProduct.save();
        return res.json({
            product: newProduct,
            message: 'Добавлен новый товар',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// UpdateProduct
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { productID } = req.params;
        const {
            name,
            category,
            price,
            description,
            count,
            abonementLessonsCount,
            active,
        } = req.body;

        const product = await Product.findOne({
            _id: productID,
        });
        if (!product)
            return res.status(402).json({
                message: 'Товар не найден',
            });

        // Checking if we are trying to use already used product
        const isUsed = await Product.findOne({ name });
        if (isUsed && product._id.toString() !== isUsed._id.toString())
            return res.status(402).json({
                message: 'Товар с данным именем уже существует',
            });

        product.name = name;
        product.category = category;
        product.price = price;
        product.description = description;
        product.count = count;
        product.abonementLessonsCount = abonementLessonsCount;
        product.active = active;

        await product.save();
        return res.json({
            product,
            message: 'Товар изменен',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetProducts
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().populate('category').exec();
        if (!products)
            return res.status(402).json({
                message: 'Товаров не найдено',
            });

        return res.json({
            products,
            message: 'Получен список товаров',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetProduct
export const getProduct = async (req: Request, res: Response) => {
    try {
        const { productID } = req.params;

        const product = await Product.findById(productID);

        if (!product)
            return res.status(402).json({
                message: 'Товар не найден',
            });

        return res.json({
            product,
            message: 'Товар найден',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
