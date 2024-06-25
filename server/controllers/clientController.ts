import { Request, Response } from 'express';
import Client from '../models/clientModel.js';
import Admin from '../models/adminModel.js';
import getAdmin from '../utils/adminUtils.js';

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

// UpdateClient
export const updateClient = async (req: Request, res: Response) => {
    try {
        const clientID = req.params.clientNumber;
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

        const client = await Client.findOne({
            clientNumber: clientID,
        });
        if (!client)
            return res.status(402).json({
                message: 'Клиент по вашему запросу не найден',
            });

        // Checking if we are trying to use already used clientNumer
        const isUsedClientNumber = await Client.findOne({ clientNumber });
        if (
            isUsedClientNumber &&
            client._id.toString() !== isUsedClientNumber._id.toString()
        )
            return res.status(402).json({
                message:
                    'Пользователь с данным клиентским номером уже существует',
            });

        // Checking if we are trying to use already used firstname and lastname combo
        const isUsedName = await Client.findOne({ firstname, lastname });
        if (isUsedName && client._id.toString() !== isUsedName._id.toString())
            return res.status(402).json({
                message: 'Пользователь с данным именем уже существует',
            });

        client.clientNumber = clientNumber;
        client.firstname = firstname;
        client.lastname = lastname;
        client.sex = sex;
        client.birthDate = birthDate;
        client.phone = phone;
        client.email = email;
        client.comment = comment;
        client.admin = adminObjectId!._id;

        await client.save();
        return res.json({
            client,
            message: 'Данные клиента изменены',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetClients
export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await Client.find().sort('-createdAt');

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

// GetClientInfo
export const getClient = async (req: Request, res: Response) => {
    try {
        const { clientNumber } = req.params;

        const client = await Client.findOne({ clientNumber });

        if (!client)
            return res.status(402).json({
                message: 'Клиента по вашему запросу не найдено',
            });

        const admin = await getAdmin(client.admin);
        const adminUsername = admin?.username;
        return res.json({
            client,
            adminUsername,
            message: 'Получены данные клиента',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
