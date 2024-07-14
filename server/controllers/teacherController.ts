import { Request, Response } from 'express';
import Teacher from '../models/teacherModel.js';
import Admin from '../models/adminModel.js';
import getAdmin from '../utils/adminUtils.js';

// AddTeacher
export const addTeacher = async (req: Request, res: Response) => {
    try {
        const {
            firstname,
            lastname,
            sex,
            birthDate,
            phone,
            email,
            comment,
            rate,
        } = req.body;
        const admin = req.headers.Admin;
        const adminObjectId = await Admin.findOne({ username: admin });

        const lastTeacher = await Teacher.findOne();
        let lastTeacherNumber = 1;
        if (lastTeacher) lastTeacherNumber = lastTeacher.teacherNumber + 1;

        const teacher = new Teacher({
            teacherNumber: lastTeacherNumber,
            firstname,
            lastname,
            sex,
            birthDate,
            phone,
            email,
            comment,
            rate,
            admin: adminObjectId!._id,
        });

        await teacher.save();
        return res.json({
            teacher,
            message: 'Добавлен новый инструктор',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// UpdateTeacher
export const updateTeacher = async (req: Request, res: Response) => {
    try {
        const teacherID = req.params.teacherNumber;
        const {
            teacherNumber,
            firstname,
            lastname,
            sex,
            birthDate,
            phone,
            email,
            comment,
            rate,
            active,
        } = req.body;
        const admin = req.headers.Admin;
        const adminObjectId = await Admin.findOne({ username: admin });

        const teacher = await Teacher.findOne({
            teacherNumber: teacherID,
        });
        if (!teacher)
            return res.status(402).json({
                message: 'Инструктор по вашему запросу не найден',
            });

        // Checking if we are trying to use already used clientNumer
        const isUsedTeacherNumber = await Teacher.findOne({
            teacherNumber,
        });
        if (
            isUsedTeacherNumber &&
            teacher._id.toString() !== isUsedTeacherNumber._id.toString()
        )
            return res.status(402).json({
                message:
                    'Инструктор с данным персональным номером уже существует',
            });

        teacher.teacherNumber = teacherNumber;
        teacher.firstname = firstname;
        teacher.lastname = lastname;
        teacher.sex = sex;
        teacher.birthDate = birthDate;
        teacher.phone = phone;
        teacher.email = email;
        teacher.comment = comment;
        teacher.rate = rate;
        teacher.active = active;
        teacher.admin = adminObjectId!._id;

        await teacher.save();
        return res.json({
            teacher,
            message: 'Данные инструктора изменены',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetTeachers
export const getTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await Teacher.find().sort('-createdAt');

        if (!teachers)
            return res.status(402).json({
                message: 'Инструкторов по вашему запросу не найдено',
            });

        return res.json({
            teachers,
            message: 'Получен список инструкторов',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// GetTeacherInfo
export const getTeacher = async (req: Request, res: Response) => {
    try {
        const { teacherNumber } = req.params;

        const teacher = await Teacher.findOne({ teacherNumber });
        if (!teacher)
            return res.status(402).json({
                message: 'Инструктора по вашему запросу не найдено',
            });

        const admin = await getAdmin(teacher.admin);
        const adminUsername = admin?.username;
        return res.json({
            teacher,
            adminUsername,
            message: 'Получены данные инструктора',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
