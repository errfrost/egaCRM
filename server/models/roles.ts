import mongoose from 'mongoose';

const { Schema } = mongoose;
const RolesSchema = new Schema(
    {
        role: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Roles', RolesSchema);
