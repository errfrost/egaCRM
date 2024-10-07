import Abonement from '../models/abonementModel.js';
import ScheduleLog from '../models/scheduleLogModel.js';
import { clearTimeInDate } from './date.js';

const addAbonement = async (client, order, maxLessons) => {
    try {
        const now = new Date();
        // дата автоматической активации абонемента - через 30 дней после продажи
        const startDate = new Date(new Date(now).setDate(now.getDate() + 30));

        // дата автоматической деактивации абонемента - через 5 недель после активации
        const endDate = new Date(
            new Date(startDate).setDate(startDate.getDate() + 35)
        );

        const abonement = new Abonement({
            client,
            startDate: clearTimeInDate(startDate),
            endDate: clearTimeInDate(endDate),
            maxLessons,
            order,
        });
        abonement.save();

        return abonement;
    } catch (error) {
        return error;
    }
};

export const countUsedLessonsInAbonement = async (abonementID) => {
    try {
        const lessons = await ScheduleLog.find({
            abonement: abonementID,
            status: true,
        });
        return lessons.length;
    } catch (error) {
        return error;
    }
};

export default addAbonement;
