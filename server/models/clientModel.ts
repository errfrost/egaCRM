import mongoose from 'mongoose';

const { Schema } = mongoose;
const ClientSchema = new Schema(
    {
        clientNumber: {
            type: String,
            required: true,
            unique: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        sex: {
            type: Boolean,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        comment: {
            type: String,
            required: false,
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
        },
        clientType: {
            type: Schema.Types.ObjectId,
            ref: 'ClientType',
        },
        clientOrders: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Orders',
            },
        ],
        abonement: {
            type: Schema.Types.ObjectId,
            ref: 'Abonement',
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Client', ClientSchema);
