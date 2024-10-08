import express from 'express'; // фреймворк для работы с NodeJS
import mongoose from 'mongoose'; // работа с MongoDB
import dotenv from 'dotenv'; // переменные окружения .env
import cors from 'cors'; // для работы бэкэнда с разными ip адресами
import authRouter from './routes/authRouter.js';
import clientRouter from './routes/clientRouter.js';
import installRouter from './routes/installRouter.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRouter.js';
import teacherRouter from './routes/teacherRouter.js';
import abonementRouter from './routes/abonementRouter.js';
import scheduleTemplateRouter from './routes/scheduleTemplateRouter.js';
import scheduleRouter from './routes/scheduleRouter.js';
import scheduleLogRouter from './routes/scheduleLogRouter.js';
import checkAuth from './middlewares/checkAuth.js';

const app = express();
dotenv.config();

const { PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

// Middleware - функция расширяет или дополняет настройки express
app.use(cors());
app.use(express.json()); // показываем экспрессу, что обмен данными с фронтэндом будет посредством json

app.get('/', (req, res) => {
    res.json({ message: 'Ok' });
});

// Routes
app.use(checkAuth);
app.use('/api/auth', authRouter);
app.use('/api/client', clientRouter);
app.use('/api/install', installRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/abonement', abonementRouter);
app.use('/api/schedule/template', scheduleTemplateRouter);
app.use('/api/schedulelog', scheduleLogRouter);
app.use('/api/schedule', scheduleRouter);

async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}`
        );
        app.listen(PORT, () => {
            console.log(`server is running (${PORT})...`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
