import mongoose from 'mongoose';

const { Schema } = mongoose;
const ScheduleTemplateSchema = new Schema(
    {
        scheduleID: {
            type: Number,
            required: true,
            unique: true,
        },
        weekDay: {
            type: Number,
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
        },
        lessonName: {
            type: String,
            required: true,
        },
        lessonType: {
            type: String, // typical, rent, service
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('ScheduleTemplate', ScheduleTemplateSchema);
