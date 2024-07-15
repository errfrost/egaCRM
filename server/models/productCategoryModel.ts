import mongoose from 'mongoose';

const { Schema } = mongoose;
const ProductCategorySchema = new Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        abonement: {
            type: Boolean,
            required: true,
            default: false,
        },
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('ProductCategory', ProductCategorySchema);
