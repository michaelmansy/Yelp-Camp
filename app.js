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

// kol el functions di gaya m3 el passport package
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
mongoose.connect('mongodb://localhost/yelp_camp',{useNewUrlParser: true});

//so that we dont have to write res.render("landing.ejs")
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride("_method"));



// Campground.create(
//     {
//         name: "Salmon Creek",
//         image: "https://images.unsplash.com/photo-1538475501351-ddcf9a9333bd?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c04574d04afc0d40c36bf0e70ff99a0f&auto=format&fit=crop&w=675&q=80",
//         description: ""
//     }, function(err,campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("newly created campground");
//             console.log(campground);
//         }
//     });



//we have our array object in top here in order to be accessible anywhere
//  var campgrounds = [
//         {name : "Salmon Creek", img : "http://www.flickr.com/photos/bcvacation/16573646931"},
//         {name : "Granite Hill", img : "https://www.google.ca/imgres?imgurl=https%3A%2F%2Fwww.planetware.com%2Fphotos-large%2FUSUT%2Futah-zion-national-park-camping-south-campground.jpg&imgrefurl=https%3A%2F%2Fwww.planetware.com%2Futah%2Fbest-campgrounds-near-zion-national-park-us-ut-113.htm&docid=QjfaaAX1d77rFM&tbnid=7bCQQHjZcvB22M%3A&vet=10ahUKEwjt_o6Y6d3dAhVjleAKHQaFC8oQMwh_KAwwDA..i&w=730&h=449&hl=en&bih=577&biw=1366&q=campgrounds&ved=0ahUKEwjt_o6Y6d3dAhVjleAKHQaFC8oQMwh_KAwwDA&iact=mrc&uact=8"},
//         {name : "Mountain's Goat Rest", img : "https://www.google.ca/imgres?imgurl=https%3A%2F%2Fwww.tripsavvy.com%2Fthmb%2FhD3_T2KhE8gQXrD-I560zKfH2iQ%3D%2F960x0%2Ffilters%3Ano_upscale()%3Amax_bytes(150000)%3Astrip_icc()%2F4008019776_66cfa6ac4a_o-5660b3095f9b583386bbda64.jpg&imgrefurl=https%3A%2F%2Fwww.tripsavvy.com%2Fbig-sur-camping-1473970&docid=ehOKX0mIIYWZQM&tbnid=rr77Xz0UzR-k6M%3A&vet=10ahUKEwjt_o6Y6d3dAhVjleAKHQaFC8oQMwiiASglMCU..i&w=960&h=640&hl=en&bih=577&biw=1366&q=campgrounds&ved=0ahUKEwjt_o6Y6d3dAhVjleAKHQaFC8oQMwiiASglMCU&iact=mrc&uact=8"}
//     ]


// tell app.js to use those 3 routes files
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);



//starting the server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("your server has started!!");
});



