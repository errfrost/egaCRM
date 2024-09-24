import { Request, Response } from 'express';
import Abonement from '../models/abonementModel.js';
import Schedule from '../models/scheduleModel.js';
import Client from '../models/clientModel.js';
import Order from '../models/orderModel.js';
import ScheduleLog from '../models/scheduleLogModel.js';
import { isDateBeforeToday } from '../utils/date.js';

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

export const updateClientVisitInScheduleRecord = async (
    req: Request,
    res: Response
) => {
    try {
        const { scheduleLogID } = req.params;
        const { clientID } = req.body;

        const log = await ScheduleLog.findById(scheduleLogID).populate(
            'client'
        );
        if (!log)
            return res.status(402).json({
                message: 'В Записи расписания не найден клиент',
            });

        const client = await Client.findById(clientID);
        if (!client)
            return res.status(402).json({
                message: 'Клиента по вашему запросу не найдено',
            });

        // проверяем какой статус у записи в расписании отмечен или не отмечен
        // если отмечен, то снимаем отметку
        if (log.status) {
            log.abonement = null;
            log.payment = 0;
            log.status = false;
        }
        // если не отмечен, ставим отметку
        else {
            // берем абонемент у которого дата окончания больше текущей и количество оставшихся занятий > 1
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

            let activeAbonementID = -1;
            for (let i = 0; i < abonement.length; i++) {
                // считаем количество посещений в каждом из абонементов выше
                // нужно найти count записей в ScheduleLog у которых abonement = нашему абонементу
                const abonementLessons = await ScheduleLog.find({
                    abonement: abonement[i]._id,
                    status: true,
                });
                const abonementLessonsCount = abonementLessons.length;
                if (abonementLessonsCount < abonement[i].maxLessons) {
                    activeAbonementID = i;
                    break;
                }
                // const abonementLessons = await ScheduleLog.aggregate([
                //     { $match: { client: clientID, abonement: abonement[0]._id } },
                //     {
                //         $lookup: {
                //             from: 'abonement',
                //             localField: '_id',
                //             foreignField: 'abonement',
                //             as: 'ab',
                //         },
                //     },
                //     {
                //         $project: {
                //             _id: 1,
                //             ab: {
                //                 $filter: {
                //                     input: '$ab',
                //                     cond: { $eq: ['$$this.status', true] },
                //                 },
                //             },
                //         },
                //     },
                // ]);
                // const abonementLessonsCount = abonementLessons.length;
            }

            if (activeAbonementID === -1)
                return res.status(402).json({
                    message: 'У клиента отстутствует активный абонемент',
                });

            // вычислим стоимость занятия для клиента
            const abonementOrder = await Order.findById(
                abonement[activeAbonementID].order
            );

            log.abonement = abonement[activeAbonementID]._id;
            log.payment =
                abonementOrder?.summ / abonement[activeAbonementID].maxLessons;
            log.status = true;

            // проверяем активированный абонемент или нет, если нет активируем его
            // дата активации должна быть меньше текущей даты
            if (!isDateBeforeToday(abonement[activeAbonementID].startDate)) {
                const now = new Date();
                const startDate = new Date(
                    new Date(now).setDate(now.getDate())
                );

                // дата автоматической деактивации абонемента - через 5 недель после активации
                const endDate = new Date(
                    new Date(startDate).setDate(startDate.getDate() + 35)
                );
                abonement[activeAbonementID].startDate = startDate;
                abonement[activeAbonementID].endDate = endDate;
                await abonement[activeAbonementID].save();
            }
        }

        await log.save();
        return res.json({
            log,
            message: 'Изменена отметка о посещении занятия клиентом',
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
