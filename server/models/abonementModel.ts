import mongoose from 'mongoose';

const { Schema } = mongoose;
const AbonementSchema = new Schema(
    {
        abonement: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Abonement', AbonementSchema);
