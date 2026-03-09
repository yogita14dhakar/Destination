const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

//singup route
router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//login route
router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
    }),
    userController.login
);

//logout route
router.get("/logout", isLoggedIn, userController.logout);

//user profile dashboard route
router
.route("/profile")
.get(isLoggedIn, userController.renderProfile)

//edit user profile route
router
.route("/profile/edit")
.get(isLoggedIn, userController.renderEditProfileForm)
.post(isLoggedIn, wrapAsync(userController.updateProfile));

module.exports = router;