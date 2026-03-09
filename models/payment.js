const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    amount: {
        type: Number,
        required: true, 
    },
    method: {
        type: String,
        enum: ["credit_card", "paypal", "bank_transfer"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;