// MiddleWare при запросах к апи проверяет авторизацию пользователя
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const checkAuth: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (['/api/auth/login', '/api/auth/register'].includes(req.path)) {
        return next();
    }

    const authHeader = req.header('Authorization');
    if (authHeader) {
        const [type, token] = authHeader.split(' ');

        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET as string);
        if (type === 'Bearer' && decodedJWT) {
            const { admin } = decodedJWT as JwtPayload;
            req.headers.Admin = admin;
            return next();
        }
    }

    return res.status(403).json({ message: 'Invalid token' });
};

export default checkAuth;
