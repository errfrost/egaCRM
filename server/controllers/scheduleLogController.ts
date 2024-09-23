import { Request, Response } from 'express';
import Abonement from '../models/abonementModel.js';
import Schedule from '../models/scheduleModel.js';
import Client from '../models/clientModel.js';
import ScheduleLog from '../models/scheduleLogModel.js';

export const getScheduleLog = async (req: Request, res: Response) => {
    try {
        const { scheduleID } = req.params;

        const timeRecord = await Schedule.findById(scheduleID);
        if (!timeRecord)
            return res.status(402).json({
                message: 'Записи в расписании по вашему запросу не найдено',
            });

        const log = await ScheduleLog.find({ schedule: scheduleID }).populate(
            'client'
        );
        if (!log)
            return res.status(402).json({
                message: 'Записанных клиентов не найдено',
            });

        return res.json({
            log,
            message: 'Найдены записанные на занятие клиенты',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const addClientToScheduleLog = async (req: Request, res: Response) => {
    try {
        // const {  } = req.params;
        const { clientNumber, scheduleID } = req.body;

        const timeRecord = await Schedule.findById(scheduleID);
        if (!timeRecord)
            return res.status(402).json({
                message: 'Записи в расписании по вашему запросу не найдено',
            });

        const client = await Client.findOne({ clientNumber });
        if (!client)
            return res.status(402).json({
                message: 'Клиента по вашему запросу не найдено',
            });

        const log = new ScheduleLog({
            schedule: timeRecord._id,
            client,
        });

        await log.save();
        return res.json({
            log,
            message: 'В очередь на посещение записан клиент',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const checkClientVisitInScheduleRecord = async (
    req: Request,
    res: Response
) => {
    try {
        const { scheduleID } = req.params;
        const { clientID } = req.body;

        const timeRecord = await Schedule.findById(scheduleID);
        if (!timeRecord)
            return res.status(402).json({
                message: 'Записи по вашему запросу не найдено',
            });

        const client = await Client.findById(clientID);
        if (!client)
            return res.status(402).json({
                message: 'Клиента по вашему запросу не найдено',
            });

        // берем абонементы клиента, у которых дата окончания больше текущей
        const abonement = await Abonement.find({
            client: clientID,
            endDate: {
                $gte: new Date().toISOString(),
            },
        });
        if (!abonement)
            return res.status(402).json({
                message: 'У клиента отстутствует активный абонемент',
            });

        // считаем количество посещений в каждом из абонементов выше
        // const abonementLessons = await ScheduleLog.find({
        //     client: clientID,
        //     abonement: abonement[0]._id,
        //     abonement.status = true,
        // });
        // const abonementLessonsCount = abonementLessons.length;

        const abonementLessons = await ScheduleLog.aggregate([
            { $match: { client: clientID, abonement: abonement[0]._id } },
            {
                $lookup: {
                    from: 'abonement',
                    localField: '_id',
                    foreignField: 'abonement',
                    as: 'ab',
                },
            },
            {
                $project: {
                    _id: 1,
                    ab: {
                        $filter: {
                            input: '$ab',
                            cond: { $eq: ['$$this.status', true] },
                        },
                    },
                },
            },
        ]);
        const abonementLessonsCount = abonementLessons.length;

        if (abonementLessonsCount === abonement.maxLessons)
            return res.status(402).json({
                message: 'У клиента отстутствует активный абонемент',
            });

        await timeRecord
            .save()
            .then
            // в abonement.usedLessons +1
            ();
        return res.json({
            timeRecord,
            message: 'Посещение клиента отмечено',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const removeClientFromScheduleLog = async (
    req: Request,
    res: Response
) => {
    try {
        const { scheduleLogID } = req.params;

        const log = await ScheduleLog.findById(scheduleLogID);
        if (!log)
            return res.status(402).json({
                message: 'В Записи расписания не найден клиент',
            });

        await log.deleteOne();
        return res.json({
            log,
            message: 'Отметка о записи или посещении клиента удалена',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
