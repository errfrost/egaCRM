import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

// Register admin
export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const isUsed = await Admin.findOne({ username });
        if (isUsed)
            return res.status(402).json({
                message: 'Пользователь с данным именем уже существует',
            });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const admin = new Admin({ username, password: hash });
        const token = jwt.sign(
            // eslint-disable-next-line no-underscore-dangle
            { admin: username },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '30d',
            }
        );

        await admin.save();
        return res.json({
            admin,
            token,
            message: 'Регистрация прошла успешно',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// Login admin
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin)
            return res.status(402).json({ message: 'Пользователь не найден' });

        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin.password
        );
        if (!isPasswordCorrect)
            return res.status(402).json({ message: 'Неверный пароль' });

        const token = jwt.sign(
            // eslint-disable-next-line no-underscore-dangle
            { admin: admin.username },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '30d',
            }
        );

        return res.json({ admin, token, message: 'Пользователь авторизован' });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// Get admin by ObjectID
export const getAdmin = async (req: Request, res: Response) => {
    try {
        const { adminID } = req.params;

        const admin = await Admin.findById(adminID);
        if (!admin)
            return res.status(402).json({ message: 'Администратор не найден' });

        return res.json({ admin, message: 'Администратор найден' });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
