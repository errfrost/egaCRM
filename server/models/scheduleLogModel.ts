import mongoose from 'mongoose';

const { Schema } = mongoose;
const ScheduleLogSchema = new Schema(
    {
        schedule: {
            type: Schema.Types.ObjectId,
            ref: 'Schedule',
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        abonement: {
            type: Schema.Types.ObjectId,
            ref: 'Abonement',
            required: true,
        },
        payment: {
            // стоимость занятия для клиента
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            // в очереди - false, отмечен - true
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model('ScheduleLog', ScheduleLogSchema);
