const Listing = require("../models/listing.js");
const tt = require("@tomtom-international/web-sdk-services/dist/services-node.min.js");
const mapkey = process.env.MAP_KEY;

//to show all listings on one page
module.exports.index = async (req, res) => {
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    let offset = (page-1)*limit;
    let country = req.query.loc;
    
    const [allListings, totalListings] = !country ? await Promise.all([
        Listing.find({},{}, { limit: limit, skip: offset}), Listing.countDocuments()
    ]) : 
    await Promise.all([
        Listing.find({ $or: [{country: { $regex: new RegExp(country, 'i') }}, 
            {location: { $regex: new RegExp(country, 'i') }}] }, {},  
            { limit: limit, skip: offset}
        ), 
        Listing.countDocuments({ $or: [{country: { $regex: new RegExp(country, 'i') }}, 
            {location: { $regex: new RegExp(country, 'i') }}] 
        })
    ]);
    
    let totalPages = Math.ceil(totalListings / limit);

    if(!allListings){
        req.flash("error", `Listing does not exist!`)
        res.redirect("/");
    }
    res.render("listings/index.ejs", {allListings, totalListings, page, totalPages, limit});
};

//new form to create new listing
module.exports.renderNewForm = 
(req, res) => {
    res.render("listings/new.ejs");
};

// to show individual listings 
module.exports.showIndividualListing = async (req, res) => {
    let { id } = req.params;
    
    let listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author"
        }
    });
    
    if(!listing){
        req.flash("error", "Listing You Are Looking For Does Not Exist!");
        res.redirect("/");
    }
    
    res.render("listings/show.ejs", {listing});
};

//to save new listing in database
module.exports.createNewListing = async (req, res) => { 

    let response = await tt.services.geocode({
        key: mapkey,
        query: req.body.listing.location,
        limit: 1
    });

    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.toGeoJson().features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/");
};

//form to edit listing
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing You Are Looking For Does Not Exist!");
        res.redirect("/");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_100");
    res.render("listings/edit.ejs", {listing, originalImage});
};

//save updates/edit made by owner of that listing
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//to delete listing by owner
module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(listing.bookings && listing.bookings.length > 0){
        req.flash("error", "Cannot delete listing with active bookings!");
        return res.redirect(`/listings/${id}`);
    }else{
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/");
    }

};
