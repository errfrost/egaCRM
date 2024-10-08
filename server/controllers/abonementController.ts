import { Request, Response } from 'express';
import Client from '../models/clientModel.js';
import Abonement from '../models/abonementModel.js';

export const getAbonements = async (req: Request, res: Response) => {
    try {
        const abonements = await Abonement.find()
            .populate('client')
            .populate({
                path: 'order',
                populate: [{ path: 'product', select: 'name' }],
            })
            .exec();
        if (!abonements)
            return res.status(402).json({
                message: 'Абонементов не найдено',
            });

        return res.json({
            abonements,
            message: 'Получен список абонементов',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetClientAbonements
export const getClientAbonements = async (req: Request, res: Response) => {
    try {
        const { clientID } = req.params;
        const client = await Client.findById(clientID);

        if (!client)
            return res.status(402).json({
                message: 'Клиент не найден',
            });

        const abonements = await Abonement.find({ client: clientID })
            .populate('client')
            .populate({
                path: 'order',
                populate: [{ path: 'product', select: 'name' }],
            })
            .exec();
        if (!abonements)
            return res.status(402).json({
                message: 'Абонементов не найдено',
            });

        return res.json({
            abonements,
            message: 'Получен список абонементов клиента',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// UpdateClientAbonement
export const updateClientAbonement = async (req: Request, res: Response) => {
    try {
        const { abonementID } = req.params;
        const { comment, startDate, endDate } = req.body;
        const abonement = await Abonement.findById(abonementID)
            .populate('client')
            .populate({
                path: 'order',
                populate: [{ path: 'product', select: 'name' }],
            })
            .exec();

        if (!abonement)
            return res.status(402).json({
                message: 'Абонемент не найден',
            });

        abonement.comment = comment;
        abonement.startDate = startDate;
        abonement.endDate = endDate;

        await abonement.save();
        return res.json({
            abonement,
            message: 'Внесены изменения в абонемент',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
