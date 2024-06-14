import express from 'express'; // фреймворк для работы с NodeJS
import mongoose from 'mongoose'; // работа с MongoDB
import dotenv from 'dotenv'; // переменные окружения .env
import cors from 'cors'; // для работы бэкэнда с разными ip адресами
import authRouter from './routes/auth.js';
import clientRouter from './routes/client.js';
import installRouter from './routes/install.js';
import checkAuth from './utils/checkAuth.js';

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
