import mongoose from 'mongoose';

const { Schema } = mongoose;
const AbonementSchema = new Schema(
    {
        clientNumber: {
            type: String,
            required: true,
            unique: true,
        },
        abonementType: {
            type: Schema.Types.ObjectId,
            ref: 'AbonementType',
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
        activeLessons: {
            type: Number,
            required: true,
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
