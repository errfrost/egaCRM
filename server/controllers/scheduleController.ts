import { Request, Response } from 'express';
import Schedule from '../models/scheduleModel.js';
import ScheduleTemplate from '../models/scheduleTemplateModel.js';
import dateToLocalISOString from '../utils/date.js';

export const getSchedule = async (req: Request, res: Response) => {
    try {
        const { date, month, year } = req.params;
        const monday = new Date(Date.UTC(year, month, date));
        monday.setHours(0, 0, 0, 0);

        const weekDay = monday.getDay();
        if (weekDay !== 1)
            return res.status(402).json({
                message: 'Полученная дата не является понедельником',
            });

        const d = new Date(monday);
        const diff = d.getDate() + 6;
        const sunday = new Date(d.setDate(diff));
        sunday.setHours(23, 59, 59);

        const schedule = await Schedule.find({
            startTime: {
                $gte: monday.toISOString(),
                $lte: sunday.toISOString(),
            },
        })
            .sort({ weekDay: 1, startTime: 1 })
            .populate('teacher', 'firstname lastname')
            .exec();
        if (!schedule)
            return res.status(402).json({
                message: 'Расписание на выбранную неделю не найдено',
            });

        return res.json({
            schedule,
            message: 'Получено расписание на выбранную неделю',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const setScheduleFromTemplate = async (req: Request, res: Response) => {
    try {
        const { date, month, year } = req.params;
        const monday = new Date(Date.UTC(year, month, date));

        const weekDay = monday.getDay();
        if (weekDay !== 1)
            return res.status(402).json({
                message: 'Полученная дата не является понедельником',
            });

        const d = new Date(monday);
        const diff = d.getDate() + 6;
        const sunday = new Date(d.setUTCDate(diff));
        sunday.setUTCHours(23);
        sunday.setUTCMinutes(59);
        sunday.setUTCSeconds(59);

        // нужно проверить не применен ли к этой неделе шаблон?

        const scheduleTemplate = await ScheduleTemplate.find()
            .sort({ weekDay: 1, startTime: 1 })
            .exec();
        if (!scheduleTemplate)
            return res.status(402).json({
                message:
                    'Ошибка копирования шаблона - шаблон расписания не найден',
            });

        // перебираем все записи шаблона
        scheduleTemplate.map(async (templateRecord) => {
            // копируем записи из шаблона в расписание
            const d = new Date(monday);
            const day = templateRecord.weekDay; // d.getDay();
            const diff = d.getDate() + day - 1;

            const currentStartTime = new Date(d.setDate(diff));
            const currentRecordStartTime = new Date(templateRecord.startTime);
            currentStartTime.setHours(currentRecordStartTime.getHours());
            currentStartTime.setMinutes(currentRecordStartTime.getMinutes());

            const currentEndTime = new Date(currentStartTime);
            const currentRecordEndTime = new Date(templateRecord.endTime);
            currentEndTime.setHours(currentRecordEndTime.getHours());
            currentEndTime.setMinutes(currentRecordEndTime.getMinutes());

            const timeRecord = new Schedule({
                weekDay: templateRecord.weekDay,
                startTime: dateToLocalISOString(currentStartTime),
                endTime: dateToLocalISOString(currentEndTime),
                teacher: templateRecord.teacher,
                lessonName: templateRecord.lessonName,
                lessonType: templateRecord.lessonType,
            });

            await timeRecord.save();
        });

        return res.json({
            result: 'ok',
            message: 'Шаблон расписания успешно применен к выбранной неделе',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const deleteSchedule = async (req: Request, res: Response) => {
    try {
        const { date, month, year } = req.params;
        const monday = new Date(Date.UTC(year, month, date));
        monday.setHours(0, 0, 0, 0);

        const weekDay = monday.getDay();
        if (weekDay !== 1)
            return res.status(402).json({
                message: 'Полученная дата не является понедельником',
            });

        const d = new Date(monday);
        const diff = d.getDate() + 6;
        const sunday = new Date(d.setDate(diff));
        sunday.setHours(23, 59, 59);

        await Schedule.deleteMany({
            startTime: {
                $gte: monday.toISOString(),
                $lte: sunday.toISOString(),
            },
        });

        return res.json({
            result: 'ok',
            message: 'Расписание текущей недели успешно очищено',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const getTimeRecord = async (req: Request, res: Response) => {
    try {
        const { scheduleID } = req.params;

        const timeRecord = await ScheduleTemplate.findOne({
            scheduleID,
        });
        if (!timeRecord)
            return res.status(402).json({
                message: 'Запись шаблона расписания не найдена',
            });

        return res.json({
            timeRecord,
            message: 'Получена запись шаблона расписания',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const addTimeRecord = async (req: Request, res: Response) => {
    try {
        const { weekDay, startTime, endTime, teacher, lessonName, lessonType } =
            req.body;

        // нужно проверить не занято ли уже данное время
        const weekDayRecords = await ScheduleTemplate.find({ weekDay });
        const isBookedTime: number = weekDayRecords.reduce((acc, record) => {
            if (
                (startTime >= record.startTime &&
                    startTime <= record.endTime) ||
                (endTime >= record.startTime && endTime <= record.endTime)
            ) {
                return acc + 1;
            }
            return acc;
        }, 0);

        if (isBookedTime > 0)
            return res.status(402).json({
                message: 'Данное время уже занято',
            });

        const lastTimeRecord = await ScheduleTemplate.findOne()
            .sort('-scheduleID')
            .exec();
        let scheduleID = 1;
        if (lastTimeRecord) scheduleID = lastTimeRecord.scheduleID + 1;

        const timeRecord = new ScheduleTemplate({
            scheduleID,
            weekDay,
            startTime,
            endTime,
            teacher,
            lessonName,
            lessonType,
        });

        await timeRecord.save();
        return res.json({
            timeRecord,
            message: 'В шаблон расписания добавлена новая запись',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const deleteTimeRecord = async (req: Request, res: Response) => {
    try {
        const { scheduleID } = req.params;
        const timeRecord = await ScheduleTemplate.findOne({
            scheduleID,
        });

        if (!timeRecord)
            return res.status(402).json({
                message: 'Записи по вашему запросу не найдено',
            });

        await timeRecord.deleteOne();
        return res.json({
            timeRecord,
            message: 'Запись в шаблоне расписания удалена',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const updateTimeRecord = async (req: Request, res: Response) => {
    try {
        const { scheduleID } = req.params;
        const { weekDay, startTime, endTime, teacher, lessonName, lessonType } =
            req.body;

        const timeRecord = await ScheduleTemplate.findOne({
            scheduleID,
        });
        if (!timeRecord)
            return res.status(402).json({
                message: 'Записи по вашему запросу не найдено',
            });

        // нужно проверить не занято ли уже данное время
        const weekDayRecords = await ScheduleTemplate.find({ weekDay });
        const isBookedTime: number = weekDayRecords.reduce((acc, record) => {
            if (scheduleID == record.scheduleID) return acc;
            if (
                (startTime >= record.startTime &&
                    startTime <= record.endTime) ||
                (endTime >= record.startTime && endTime <= record.endTime)
            ) {
                return acc + 1;
            }
            return acc;
        }, 0);
        if (isBookedTime > 0)
            return res.status(402).json({
                message: 'Данное время уже занято',
            });

        timeRecord.weekDay = weekDay;
        timeRecord.startTime = startTime;
        timeRecord.endTime = endTime;
        timeRecord.teacher = teacher;
        timeRecord.lessonName = lessonName;
        timeRecord.lessonType = lessonType;

        await timeRecord.save();
        return res.json({
            timeRecord,
            message: 'Запись в шаблоне расписания изменена',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
