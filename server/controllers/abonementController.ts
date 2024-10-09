import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Client from '../models/clientModel.js';
import Abonement from '../models/abonementModel.js';
import Order from '../models/orderModel.js';
import scheduleLog from '../models/scheduleLogModel.js';

export const getAbonements = async (req: Request, res: Response) => {
    try {
        // const abonements = await Abonement.find()
        //     .populate('client')
        //     .populate({
        //         path: 'order',
        //         populate: [{ path: 'product', select: 'name' }],
        //     })
        //     .exec();

        const abonements = await Abonement.aggregate([
            {
                $lookup: {
                    from: 'schedulelogs',
                    pipeline: [
                        {
                            $match: {
                                status: { $eq: true },
                            },
                        },
                    ],
                    localField: '_id',
                    foreignField: 'abonement',
                    as: 'visits',
                },
            },
            {
                $addFields: {
                    usedLessons: { $size: '$visits' },
                },
            },
        ]);
        await Client.populate(abonements, { path: 'client' });
        await Order.populate(abonements, {
            path: 'order',
            populate: [{ path: 'product', select: 'name' }],
        });

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

        // const abonements = await Abonement.find({ client: clientID })
        //     .populate('client')
        //     .populate({
        //         path: 'order',
        //         populate: [{ path: 'product', select: 'name' }],
        //     })
        //     .exec();
        const abonements = await Abonement.aggregate([
            { $match: { client: new mongoose.Types.ObjectId(clientID) } }, // тут еще надо считать записи где status true
            {
                $lookup: {
                    from: 'schedulelogs',
                    pipeline: [
                        {
                            $match: {
                                status: { $eq: true },
                            },
                        },
                    ],
                    localField: '_id',
                    foreignField: 'abonement',
                    as: 'visits',
                },
            },
            {
                $addFields: {
                    usedLessons: { $size: '$visits' },
                },
            },
        ]);
        await Client.populate(abonements, { path: 'client' });
        await Order.populate(abonements, {
            path: 'order',
            populate: [{ path: 'product', select: 'name' }],
        });

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
