import mongoose from 'mongoose';

const { Schema } = mongoose;
const OrderSchema = new Schema(
    {
        summ: {
            type: Number,
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);
