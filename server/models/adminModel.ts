import mongoose from 'mongoose';

const { Schema } = mongoose;
const AdminSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstname: {
            type: String,
            required: true,
            unique: true,
        },
        lastname: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Roles',
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Admin', AdminSchema);
