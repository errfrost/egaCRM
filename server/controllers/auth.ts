import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/user.js';

// Register user
export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const isUsed = await User.findOne({ username });
        if (isUsed)
            return res.status(402).json({
                message: 'Пользователь с данным именем уже существует',
            });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const user = new User({ username, password: hash });
        const token = jwt.sign(
            // eslint-disable-next-line no-underscore-dangle
            { id: user._id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '30d',
            }
        );

        await user.save();
        return res.json({
            user,
            token,
            message: 'Регистрация прошла успешно',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user)
            return res.status(402).json({ message: 'Пользователь не найден' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(402).json({ message: 'Неверный пароль' });

        const token = jwt.sign(
            // eslint-disable-next-line no-underscore-dangle
            { id: user._id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '30d',
            }
        );

        return res.json({ user, token, message: 'Пользователь авторизован' });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// User info
// export const userInfo = async (req: Request, res: Response) => {
//     try {
//     } catch (error) {}
// };
