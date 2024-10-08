import mongoose from 'mongoose';

const { Schema } = mongoose;
const AbonementSchema = new Schema(
    {
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        maxLessons: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Abonement', AbonementSchema);
