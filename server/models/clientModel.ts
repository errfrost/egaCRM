import mongoose from 'mongoose';

const { Schema } = mongoose;
const ClientSchema = new Schema(
    {
        clientNumber: {
            type: String,
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
            required: true,
        },
        clientType: {
            type: Schema.Types.ObjectId,
            ref: 'ClientType',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Client', ClientSchema);
