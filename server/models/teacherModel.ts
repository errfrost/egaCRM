import mongoose from 'mongoose';

const { Schema } = mongoose;
const TeacherSchema = new Schema(
    {
        teacherNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        sex: {
            type: Boolean,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        comment: {
            type: String,
            required: false,
        },
        rate: {
            type: Number,
            required: true,
            default: 40,
        },
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Teacher', TeacherSchema);
