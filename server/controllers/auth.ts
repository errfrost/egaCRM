import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import Admin from '../models/admin.js';

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
            { id: admin._id },
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
            { id: admin._id },
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
