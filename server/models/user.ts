import mongoose from 'mongoose';

const { Schema } = mongoose;
const UserSchema = new Schema(
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
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Roles',
        },
        active: {
            type: Boolean,
            default: true,
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post', // ссылка на другую схему - Post
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('User', UserSchema);
