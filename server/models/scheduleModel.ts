import mongoose from 'mongoose';

const { Schema } = mongoose;
const ScheduleSchema = new Schema(
    {
        datetime: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true,
        },
        lessonName: {
            type: String,
            required: true,
        },
        lessonType: {
            type: String, // typical, rent, service
            required: true,
        },
        clients: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Client',
                required: true,
            },
        ],
        // в payment содержится массив стоимостей, которые инструктор получает с каждого отмеченного клиента
        clientPayment: [
            {
                type: Number,
                required: true,
            },
        ],
        clientsInLine: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Client',
                required: true,
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Schedule', ScheduleSchema);
