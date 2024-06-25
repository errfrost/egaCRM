import { Response, Request } from 'express';
import Roles from '../models/rolesModel.js';
import AbonementType from '../models/abonementTypeModel.js';
import ClientType from '../models/clientTypeModel.js';

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

const installClientTypes = async () => {
    try {
        const clientTypesData = [
            { type: 'standart', discount: 0 },
            { type: 'svoi', discount: 100 },
        ];
        await ClientType.insertMany(clientTypesData);

        return {
            message: 'Инсталляция ClientTypes прошла успешно',
        };
    } catch (error) {
        return {
            message: 'Инсталляция ClientTypes прошла с ошибкой',
        };
    }
};

const installAbonementTypes = async () => {
    try {
        const abonementTypesData = [
            { abonement: 'Разовый' },
            { abonement: '4 занятия' },
            { abonement: '8 занятий' },
            { abonement: '12 занятий' },
        ];
        await AbonementType.insertMany(abonementTypesData);

        return {
            message: 'Инсталляция AbonementType прошла успешно',
        };
    } catch (error) {
        return {
            message: 'Инсталляция AbonementType прошла с ошибкой',
        };
    }
};

// Install DB
const install = async (req: Request, res: Response) => {
    try {
        await installRoles();
        await installAbonementTypes();
        await installClientTypes();
        return res.json({
            message: 'Инсталляция DB прошла успешно',
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export default install;
