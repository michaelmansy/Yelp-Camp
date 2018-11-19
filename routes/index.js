var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


//setting the root route
router.get("/", function(req,res){
   res.render("campgrounds/landing"); 
});





// ==================
// AUTH ROUTES
// =================

// show the register form
router.get("/register", function(req,res){
   res.render("register");
});

// handle the sign up form logic
router.post("/register", function(req,res){
   var newUser = new User({username: req.body.username});
   User.register(newUser , req.body.password , function(err,user){
      if(err){
          req.flash("error", err.message);
          return res.render("register");
      } 
      passport.authenticate("local")(req,res,function(){
         req.flash("success", "welcome to Yelp Camp: " + req.body.username);
         res.redirect("/campgrounds") 
      });
   });
});



// show the login form
router.get("/login", function(req, res) {
    res.render("login");
})

// handling the login logic using a middleware
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req, res) {
    
})



// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success" , "you have been successfully logged out!");
    res.redirect("/campgrounds");
})


// middleware function to restrict the access if not logged in
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please login first");
    res.redirect("/login");
}


module.exports = router;