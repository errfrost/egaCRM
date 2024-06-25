import mongoose from 'mongoose';

const { Schema } = mongoose;
const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'ProductCategory',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        count: {
            type: Number,
            required: true,
            default: 0,
        },
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Product', ProductSchema);
