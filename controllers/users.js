const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
};

module.exports.signup = async(req, res) => {
    try{
        let{username, password, email} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=> {
            if(err){
               return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/");
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) =>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/");
    });
};

//to render client profile page
module.exports.renderClientProfile = async (req, res) => {
    let user = await User.findById(req.user._id);
    res.render("users/profile.ejs", {user});
};

//to render client profile edit form
module.exports.renderEditProfileForm = async (req, res) => {
    let user = await User.findById(req.user._id);
    res.render("users/editProfile.ejs", {user});
};

//to update client profile
module.exports.updateProfile = async (req, res) => {
    await User.findByIdAndUpdate(req.body.user);
    req.flash("success", "Profile updated successfully!");
    res.redirect("/");
};