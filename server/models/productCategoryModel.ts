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
        service: {
            // услуга или нет
            type: Boolean,
            required: true,
            default: false,
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
