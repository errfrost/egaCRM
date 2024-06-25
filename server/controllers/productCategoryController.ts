import { Request, Response } from 'express';
import ProductCategory from '../models/productCategoryModel.js';

// AddCategory
export const addProductCategory = async (req: Request, res: Response) => {
    try {
        const { category, description } = req.body;

        const isUsed = await ProductCategory.findOne({ category });
        if (isUsed)
            return res.status(402).json({
                message: 'Категория с таким именем уже существует',
            });

        const newCategory = new ProductCategory({
            category,
            description,
        });

        await newCategory.save();
        return res.json({
            newCategory,
            message: 'Добавлена новая категория',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetCategories
export const getProductCategories = async (req: Request, res: Response) => {
    try {
        const categories = await ProductCategory.find().sort('category');

        if (!categories)
            return res.status(402).json({
                message: 'Категорий не найдено',
            });

        return res.json({
            categories,
            message: 'Получен список категорий',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetCategory
export const getProductCategory = async (req: Request, res: Response) => {
    try {
        const { categoryID } = req.params;

        const category = await ProductCategory.findById(categoryID);

        if (!category)
            return res.status(402).json({
                message: 'Категория не найдена',
            });

        return res.json({
            category,
            message: 'Категория найдена',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
