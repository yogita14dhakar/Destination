// const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        default: "user",  
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
    },
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
