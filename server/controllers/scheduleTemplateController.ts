import { Request, Response } from 'express';
import ScheduleTemplate from '../models/scheduleTemplateModel.js';

export const getScheduleLessons = async (req: Request, res: Response) => {
    try {
        const scheduleLessons = await ScheduleTemplate.distinct('lessonName');
        if (!scheduleLessons)
            return res.status(402).json({
                message: 'Записей не найдено',
            });

        return res.json({
            scheduleLessons,
            message: 'Получен список занятий шаблона расписания',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const getScheduleTemplate = async (req: Request, res: Response) => {
    try {
        const scheduleTemplate = await ScheduleTemplate.find()
            .sort({ weekDay: 1, startTime: 1 })
            .populate('teacher', 'firstname lastname')
            .exec();
        if (!scheduleTemplate)
            return res.status(402).json({
                message: 'Шаблон расписания не найден',
            });

        return res.json({
            scheduleTemplate,
            message: 'Получен шаблон расписания',
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
