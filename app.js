var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// requiring the routes from the 3 files
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");


//referencing the main.css file to do our styles
app.use(express.static(__dirname +"/public"));


seedDB();  //seed the database

app.use(flash()); //better before the passport configuration

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "once again camping !!",
    resave: false,
    saveUninitialized: false
}));

// functions that comes with passport package
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// navbar to be deal right with all 3 links in every route
// a way to know the id of every user logged in
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error"); //whenever there is a problem we have access to flash messages here 
   res.locals.success = req.flash("success"); //whenever there is a problem we have access to flash messages here 
   next();
});


//connect mongoose to our database which we will create
// mongoose.connect('mongodb://localhost/yelp_camp',{useNewUrlParser: true});


mongoose.connect('mongodb://michael:lola7777@ds157544.mlab.com:57544/yelpcamp',{useNewUrlParser: true});



//so that we dont have to write res.render("landing.ejs")
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride("_method"));



// tell app.js to use those 3 routes files
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);



//starting the server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("your server has started!!");
});



