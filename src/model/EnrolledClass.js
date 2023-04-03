import mongoose from "mongoose";

const enrolledClassSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'roles'
    },
    classGroup: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'classes'
    },
    finalGrade: {
        type: Number
    },
    frequency: {
        type: Number
    }
}, {
    versionKey: false
})

const model = mongoose.model('enrolledClass', enrolledClassSchema);

export default model;