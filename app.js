const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// ejs mate da zay templates keda lel html 3shan mano3odsh ne3id el code f kol el views: npm i ejs-mate 3shan t install el awel
const ejsMate = require('ejs-mate');
const joi = require('joi');    //library to handle server side errors

const session = require('express-session');     //first install it: npm i express-session
const flash = require('connect-flash');         // first install it: npm i connect-flash

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const methodOverride = require('method-override');

const Campground = require('./models/campground');    //contains the schema model 
const Review = require('./models/review');   //contains the review model
const Joi = require('joi');

const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');

// requiring the campgrounds routes
const campgroundRoutes = require('./routes/campgrounds');
// requiring the reviews routes
const reviewRoutes = require('./routes/reviews');
// requiring the users routes
const userRoutes = require('./routes/users');



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate);    //for ejsMate to work


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))   //to serve our public directory zay el views keda f line 37

//da bas 3shan el req.body mayerg3sh empty so just add this line to be able to access the body of the request el
// fih el id w 7agat tanya
app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));


//configuring the express sessions and when it expires; all coming from docs
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,    //expires in a week ya3ni: todays date plus a week in millisec
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



//will define the validation schema function here and call it in the selective routes we want which are the new and update
// he will then put this in a different file then require the file here but ill just leave here
const validateCampground = (req,res,next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            description: Joi.string().required(),
            image: Joi.string().required(),
            location: Joi.string().required(),  
        }).required()
    })
    const{error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 404)
    }
    else{
        next();
    }
}

// now same validation process for the Reviews
const validateReview = (req,res,next) => {
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().required(),
            body: Joi.string().required()
        }).required()
    })
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 404)
    }
    else{
        next();
    }
}
// above 2 validation processes are ideally to be moved out in a separate scemas.js
// first line for each validation model*(we have 2: campground & review): module.exports.reviewSchema = Joi.object({line 62 to 77}) 





// using session w flash
app.use(session(sessionConfig))
app.use(flash());


// make sure to use the session in passport under the session (as said in docs)
// passport will be reponsible for the authentication and it will hash the password and all that we did manually before (line 139)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//middleware for routes that have flash messages - next step display the message in boilerplate.js
app.use((req,res,next) => {
    res.locals.currentUser = req.user;      //3shan yeb2a 3andena access lel user f kol el templates
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// fake route to test passport working 
app.get('/fakeUser', async (req,res) =>{
    const user = new User({email: 'mansino@yahoo.ca', username: 'mansy'});
    const newUser = await User.register(user, 'chicken');    //register is automatically with passport, chicken is the password
    res.send(newUser)
})




// app.use 3shan el campgrounds routes el f folder tani
app.use('/campgrounds', campgroundRoutes);

// app.use 3shan el campgrounds routes el f folder tani
app.use('/campgrounds/:id/reviews', reviewRoutes);

// app.use 3shan el users routes el f folder tani el routes
app.use('/', userRoutes);

app.get('/', (req,res) => {
    res.render('home');
})






// order of routes is important so this goes at the end to check if the route submitted is invalid
app.all(/(.*)/, (req,res,next) => {
    next(new ExpressError('Page not found'), 404);
})

// generic error handler
app.use((err,req,res,next)=>{
    const {statusCode = 500, message = 'something went wrong'} = err;
    res.status(statusCode).render('error', {err});
    // res.send("SOMETHING WENT WRONG");
})



// this file is now really getting long with all the routes so ideally we split 
// create a folder called routes with one file called campgrounds.js and export it for example where it has all the routes that start with campground in the path
// then here require this file: const campgroundRoutes = require('./routes/campgrounds') then use it: app.use('/campgrounds', campgroundRoutes)
// we can group other routes for something else like users in another file
// DONE ALREADY BUT LEAVING THE COMMENTS

app.listen(3000, () => {
    console.log('serving on port 3000');
})