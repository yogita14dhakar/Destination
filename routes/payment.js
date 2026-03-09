const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isBookingPresent, validatePayment} = require("../middleware.js");
const paymentController = require("../controllers/payment.js");
const express = require("express");
const router = express.Router();

//webhook route for payment
router
.route("/webhook")
.post(express.raw({type: "application/json"}), isLoggedIn, isBookingPresent, validatePayment, wrapAsync(paymentController.createPayment));

router
.route("/verify")
.get(isLoggedIn, isBookingPresent, wrapAsync(paymentController.verifyPayment));

module.exports = router;