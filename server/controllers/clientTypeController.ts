import { Request, Response } from 'express';
import ClientType from '../models/clientTypeModel.js';

export const addClientType = async (req: Request, res: Response) => {
    try {
        const { type, discount } = req.body;

        const isUsed = await ClientType.findOne({ type });
        if (isUsed)
            return res.status(402).json({
                message: 'Категория клиентов с таким именем уже существует',
            });

        const newType = new ClientType({ type, discount });

        await newType.save();
        return res.json({
            clientType: newType,
            message: 'Добавлена новая категория клиентов',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const updateClientType = async (req: Request, res: Response) => {
    try {
        const { clientTypeID } = req.params;
        const { type, discount } = req.body;

        const updatedClientType = await ClientType.findOne({
            _id: clientTypeID,
        });
        if (!updatedClientType)
            return res.status(402).json({
                message: 'Категория клиента не найдена',
            });

        // Checking if we are trying to use already used category
        const isUsed = await ClientType.findOne({ type });
        if (
            isUsed &&
            updatedClientType._id.toString() !== isUsed._id.toString()
        )
            return res.status(402).json({
                message: 'Категория клиентов с данным именем уже существует',
            });

        updatedClientType.type = type;
        updatedClientType.discount = discount;

        await updatedClientType.save();
        return res.json({
            clientType: updatedClientType,
            message: 'Категория клиентов изменена',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const getClientTypes = async (req: Request, res: Response) => {
    try {
        const clientTypes = await ClientType.find().sort('type');

        if (!clientTypes)
            return res.status(402).json({
                message: 'Категорий клиентов не найдено',
            });

        return res.json({
            clientTypes,
            message: 'Получен список категорий клиентов',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// // GetCategory
// export const getProductCategory = async (req: Request, res: Response) => {
//     try {
//         const { categoryID } = req.params;

//         const category = await ProductCategory.findById(categoryID);

//         if (!category)
//             return res.status(402).json({
//                 message: 'Категория не найдена',
//             });

//         return res.json({
//             category,
//             message: 'Категория найдена',
//         });
//     } catch (error) {
//         return res.status(400).json({ message: error });
//     }
// };
