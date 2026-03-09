const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        filters: Joi.array().items(Joi.string()),
        availableSuite: Joi.number().required().min(1),
        guests: Joi.number().required().min(1),
        bed: Joi.string().required(),
        bedroom: Joi.string().required(),
        bathroom: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        checkIn: Joi.date().required(),
        checkOut: Joi.date().required(),
        guests: Joi.number().required().min(1),
        user: Joi.string().required(),
        status: Joi.string().valid("pending", "confirmed", "cancelled").default("pending")
    }).required()
});

module.exports.paymentSchema = Joi.object({
    payment: Joi.object({
        amount: Joi.number().required().min(0),
        method: Joi.string().required(),
        status: Joi.string().valid("pending", "completed", "failed").default("pending"),
        booking: Joi.string().required()
    }).required()
});

