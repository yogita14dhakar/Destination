const Booking = require("./models/booking.js");
const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema, bookingSchema}= require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const mongoose = require("mongoose");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to make changes!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isListingOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isBookingOwner = async(req, res, next) => {
    let {id} = req.params;
    let booking = await Booking.findById(id);
    if(!booking.user._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of booking!");
        return res.redirect(`/bookings/${id}`);
    }
    next();
}

//validation listing middleware
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// validate listing id 
module.exports.isListingPresent = (req, res, next) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params)){
        req.flash("error", "Listing You Are Looking For Does Not Exist!");
        res.redirect("/listings");
    } next();
}

//validate reviews middleware
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//validate booking middleware
module.exports.validateBooking = (req, res, next) => {
    let {error} = bookingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// validate booking id
module.exports.isBookingPresent = (req, res, next) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params)){
        req.flash("error", "Booking You Are Looking For Does Not Exist!");
        res.redirect("/bookings");
    } next();
}

//validate payment middleware
module.exports.validatePayment = (req, res, next) => {
    let {error} = paymentSchema.validate((json.parse(req.body)).payload.payment.entity);
    const signature = req.headers["x-razorpay-signature"];
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");
    if(signature !== expectedSignature){
        throw new ExpressError(400, "Invalid signature");
    }
    else if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}
