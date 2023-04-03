import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    methods: {
        type: [{
            type: String
        }],
        required: true
    }
}, {
    versionKey: false
})

const model = mongoose.model('actions', actionSchema);

export default model;