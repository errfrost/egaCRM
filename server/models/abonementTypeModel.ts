import mongoose from 'mongoose';

const { Schema } = mongoose;
const AbonementTypeSchema = new Schema(
    {
        abonement: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('AbonementType', AbonementTypeSchema);
