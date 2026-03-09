const Payment = require("../models/payment");
const Booking = require("../models/booking");
const { json } = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");

module.exports.createPayment = async (req, res) => {
    const event = json.parse(req.body);
    let {id} = req.params;
    if(event.event === "payment.captured"){
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let booking = await Booking.findById(id).session(session);
            let newPayment = new Payment(event.payload.payment.entity).session(session);
            newPayment.booking = booking._id;
            booking.status = "confirmed";
            await newPayment.save();
            await booking.save();
            await session.commitTransaction();
            session.endSession();
            req.flash("success", "Payment Successful!");
            res.render("users/profile.ejs",{user: req.user});
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            req.flash("error", "Payment Failed!");
            res.redirect("/bookings");
        }
    }
};

module.exports.verifyPayment = async (req, res) => {
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.query;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

    if(expectedSignature !== razorpay_signature){
        req.flash("error", "invalid payment signature!");
        res.redirect("/bookings");
    }
};
