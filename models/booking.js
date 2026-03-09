const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    Guests:{
        type: Number,
    },
    checkIn:{
        type: Date,
    },
    checkOut:{
        type: Date,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    status:{
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
});



const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;