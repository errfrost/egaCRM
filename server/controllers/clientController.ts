import { Request, Response } from 'express';
import Client from '../models/client.js';
import Admin from '../models/admin.js';

// AddClient
export const addClient = async (req: Request, res: Response) => {
    try {
        const {
            clientNumber,
            firstname,
            lastname,
            sex,
            birthDate,
            phone,
            email,
            comment,
        } = req.body;
        const admin = req.headers.Admin;
        const adminObjectId = await Admin.findOne({ username: admin });

        const isUsedClientNumber = await Client.findOne({ clientNumber });
        if (isUsedClientNumber)
            return res.status(402).json({
                message:
                    'Пользователь с данным клиентским номером уже существует',
            });
        const isUsed = await Client.findOne({ firstname, lastname });
        if (isUsed)
            return res.status(402).json({
                message: 'Пользователь с данным именем уже существует',
            });

        const client = new Client({
            clientNumber,
            firstname,
            lastname,
            sex,
            birthDate,
            phone,
            email,
            comment,
            admin: adminObjectId!._id,
        });

        await client.save();
        return res.json({
            client,
            message: 'Добавлен новый клиент',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetClient
export const getClients = async (req: Request, res: Response) => {
    try {
        const {
            clientNumber,
            firstname,
            lastname,
            sex,
            birthDate,
            phone,
            email,
        } = req.body;
        // const admin = req.headers.Admin;
        // const adminObjectId = await Admin.findOne({ username: admin });

        const clients = await Client.find({});

        if (!clients)
            return res.status(402).json({
                message: 'Клиентов по вашему запросу не найдено',
            });

        return res.json({
            clients,
            message: 'Получен список клиентов',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
