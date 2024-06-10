// MiddleWare при запросах к апи проверяет авторизацию пользователя
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthToken } from '../types.js';

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        const [type, token] = authHeader.split(' ');
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as AuthToken;
        if (type === 'Bearer' && decoded) {
            req.headers.adminId = decoded.adminId;
            return next();
        }
    }
    return res.status(403).json({ message: 'Invalid token' });
};

export default checkAuth;
