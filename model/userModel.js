const mongoose = require('mongoose');
const { isLowercase } = require('validator');


const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },

    lastName: {
        type: String
    },

    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String
    },

    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String
    },
    photoUrl: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkkE1LSJXHRCOSWyn1wFq8RhGSO8_geSROkA&s '
    },
    about: {
        type: String,
        default: "this is about us value of user..."
    },
    skills: {
        type: [String]
    }

}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;