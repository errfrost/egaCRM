import { Response, Request } from 'express';
import Roles from '../models/roles.js';

const installRoles = async () => {
    try {
        const rolesData = [
            { role: 'admin' },
            { role: 'administrator' },
            { role: 'root' },
        ];
        await Roles.insertMany(rolesData);

        return {
            message: 'Инсталляция Roles прошла успешно',
        };
    } catch (error) {
        return {
            message: 'Инсталляция Roles прошла с ошибкой',
        };
    }
};

// Install DB
export const install = async (req: Request, res: Response) => {
    try {
        await installRoles();
        return res.json({
            message: 'Инсталляция DB прошла успешно',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
