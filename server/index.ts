import express from 'express';

const app = express();
app.listen(5005, () => {
    console.log('server is running...');
});
