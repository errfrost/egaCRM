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
    },
    { timestamps: true }
);

export default mongoose.model('ProductCategory', ProductCategorySchema);
