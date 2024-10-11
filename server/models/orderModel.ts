import mongoose from 'mongoose';

const { Schema } = mongoose;
const OrderSchema = new Schema(
    {
        orderNumber: {
            type: Number,
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        // стоимость выбранного товара*количество с учетом скидки
        summ: {
            type: Number,
            required: true,
        },
        // count: {
        //     type: Number,
        //     required: true,
        // },
        status: {
            type: String,
            required: true,
            default: 'ok', // 'canceled', 'credit'
        },
        discount: {
            type: Number,
            required: true,
            default: 0,
        },
        // внесенная сумма, которую клиент оплатил за весь заказ
        fullCartPaymentSum: {
            type: Number,
            required: true,
            default: 0,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
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
