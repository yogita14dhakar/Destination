const Booking = require("../models/booking");
const Listing = require("../models/listing");

//render booking form
module.exports.renderBookingForm = async (req, res) => {
    let user = await User.findById(req.user._id);
    if(!user.phoneNumber){
        req.flash("error", "Please Add Your Phone Number To Book A Listing!");
        return res.render("users/editProfile.ejs");   //redirect to edit user profile page to add phone number
    }
    res.render("bookings/newBooking.ejs");
};

//to save new booking in database
module.exports.createBooking = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newBooking = new Booking(req.body.booking);
    newBooking.user = req.user._id;
    listing.bookings.push(newBooking);
    await newBooking.save();
    await listing.save(); 
    req.flash("success", "Booking Created!");
    res.render(`payments/payment.ejs`, {booking: newBooking}); //payment page after booking creation
};

//to show booking to owner of that booking
module.exports.showBooking = async (req, res) => {
    let {bookingId} = req.params;
    let booking = await Booking.findById(bookingId);
    res.render("bookings/booking.ejs", {booking});
};

//to edit booking by owner of that booking
module.exports.editBooking = async (req, res) => {
    let {bookingId} = req.params;
    let booking = await Booking.findById(bookingId);
    if(booking.status === "cancelled"){
        req.flash("error", `You Cannot Edit A ${booking.status} Booking!`);
        return res.redirect(`/listings/${booking.listing}`);
    }else{
        res.render("bookings/editBooking.ejs", {booking});
    }
}

//to delete pending booking by owner of that booking
module.exports.deleteBooking = async (req, res) => {
    let {bookingId} = req.params;
    let booking = await Booking.findById(bookingId);
    if(booking.status === "confirmed" || booking.status === "cancelled"){
        req.flash("error", `You Cannot Delete A ${booking.status} Booking!`);
    }else{
        await Listing.findByIdAndUpdate(booking.listing, {$pull: {bookings: bookingId}});
        await Booking.findByIdAndDelete(bookingId);
        req.flash("success", "Booking Deleted!");
    }
    res.redirect(`/`);
};