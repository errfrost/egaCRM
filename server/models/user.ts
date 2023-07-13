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
