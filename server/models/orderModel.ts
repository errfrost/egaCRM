import mongoose from 'mongoose';

const { Schema } = mongoose;
const OrderSchema = new Schema(
    {
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        summ: {
            type: Number,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'ok', // 'canceled', 'credit'
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);
