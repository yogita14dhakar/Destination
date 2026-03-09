const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isBookingOwner, isBookingPresent, validateBooking} = require("../middleware.js");
const bookingController = require("../controllers/booking.js");
const express = require("express");
const router = express.Router();

//root route for booking
router
.route("/bookings")
.get(isLoggedIn, wrapAsync(bookingController.renderBookingForm));

//create booking in database
router 
.route("/bookings/:listingId")  
.post(isLoggedIn, validateBooking, wrapAsync(bookingController.createBooking));

//edit route for booking
router
.route("/bookings/:bookingId/edit")
.get(isLoggedIn, isBookingPresent, isBookingOwner, wrapAsync(bookingController.editBooking));


//delete route for pending booking
router
.route("/bookings/:bookingId")
.get(isLoggedIn, isBookingPresent, isBookingOwner, wrapAsync(bookingController.showBooking))
.delete(
    isLoggedIn,
    isBookingPresent,
    isBookingOwner,
    wrapAsync(bookingController.deleteBooking)
);

module.exports = router;