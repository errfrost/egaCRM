import { Request, Response } from 'express';
import Client from '../models/clientModel.js';
import Admin from '../models/adminModel.js';
import ScheduleLog from '../models/scheduleLogModel.js';
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
            instagram,
            comment,
            clientType,
        } = req.body;
        const admin = req.headers.Admin;
        const adminObjectId = await Admin.findOne({ username: admin });

        const isUsedClientNumber = await Client.findOne({ clientNumber });
        if (isUsedClientNumber)
            return res.status(402).json({
                message:
                    'Пользователь с данным клиентским номером уже существует',
            });
        const isUsed = await Client.findOne({ firstname, lastname, birthDate });
        if (isUsed)
            return res.status(402).json({
                message: 'Пользователь с данным именем уже существует',
            });
        const isUsedPhone = await Client.findOne({ phone });
        if (isUsedPhone)
            return res.status(402).json({
                message:
                    'Пользователь с данным номером телефона уже существует',
            });

        const client = new Client({
            clientNumber,
            firstname,
            lastname,
            sex,
            birthDate,
            phone,
            email,
            instagram,
            comment,
            admin: adminObjectId!._id,
            clientType,
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
        const { clientID } = req.params;
        const {
            clientNumber,
            firstname,
            lastname,
            sex,
            birthDate,
            phone,
            email,
            instagram,
            comment,
            balance,
            clientType,
        } = req.body;
        const admin = req.headers.Admin;
        const adminObjectId = await Admin.findOne({ username: admin });

        const client = await Client.findById(clientID);
        if (!client)
            return res.status(402).json({
                message: 'Клиент по вашему запросу не найден',
            });

        if (!firstname && (balance || balance === 0)) {
            client.admin = adminObjectId!._id;
            client.balance += balance;

            await client.save();
            return res.json({
                client,
                message: 'Баланс клиента изменен',
            });
        }

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
        const isUsedName = await Client.findOne({
            firstname,
            lastname,
            birthDate,
        });
        if (isUsedName && client._id.toString() !== isUsedName._id.toString())
            return res.status(402).json({
                message: 'Пользователь с данным именем уже существует',
            });

        // Checking if we are trying to use already used phone number
        const isUsedPhone = await Client.findOne({ phone });
        if (isUsedPhone && client._id.toString() !== isUsedPhone._id.toString())
            return res.status(402).json({
                message:
                    'Пользователь с данным номером телефона уже существует',
            });

        client.clientNumber = clientNumber;
        client.firstname = firstname;
        client.lastname = lastname;
        client.sex = sex;
        client.birthDate = birthDate;
        client.phone = phone;
        client.email = email;
        client.instagram = instagram;
        client.comment = comment;
        client.admin = adminObjectId!._id;
        client.clientType = clientType;

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
        const { clientID } = req.params;

        const client = await Client.findById(clientID);

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

// findClients by search request
export const findClients = async (req: Request, res: Response) => {
    try {
        let { searchText } = req.body;
        searchText = searchText.replace(/\s+/g, ''); // remove spaces from the search text

        const clientsByLastname = await Client.find({
            lastname: new RegExp(searchText, 'i'),
        });
        const clientsByClientNumber = await Client.find({
            clientNumber: new RegExp(searchText, 'i'),
        });
        // const clientsByPhone = await Client.find({ clientNumber: searchText });

        const clients = [...clientsByLastname, ...clientsByClientNumber];

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

export const getClientVisitLogs = async (req: Request, res: Response) => {
    try {
        const { clientID } = req.params;

        const client = await Client.findById(clientID);

        if (!client)
            return res.status(402).json({
                message: 'Клиента по вашему запросу не найдено',
            });

        const log = await ScheduleLog.find({ client: clientID, status: true })
            .populate('client')
            .populate({ path: 'abonement', select: '_id maxLessons' })
            .populate({
                path: 'schedule',
                populate: [{ path: 'teacher', select: 'lastname firstname' }],
            });

        if (!log)
            return res.status(402).json({
                message: 'Записей о посещениях клиента не найдено',
            });

        return res.json({
            log,
            message: 'Получены данные о посещениях клиента',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
