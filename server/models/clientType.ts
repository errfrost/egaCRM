import mongoose from 'mongoose';

const { Schema } = mongoose;
const ClientTypeSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            unique: true,
        },
        discount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model('ClientType', ClientTypeSchema);
