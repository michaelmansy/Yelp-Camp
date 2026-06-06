// controllers directory will be like the routes so we can slim down the routes files

const Campground = require('../models/campground');    //contains the schema model 

module.exports.index = async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}


module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
};


module.exports.createCampground = async(req,res) => {
    // throw an error if someone submits an empty campground (cant happen from the form 3shan el validation bas postman maslan)
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Information', 400)
    //line above no longer needed after using the joi library for handling errors; whats coming is from the docs so nothing to learn
    const campground = new Campground(req.body.campground);     ///what we added in line 24 is for this to actualy show up
    // now make sure the newly campgorund created is associated with the user logged in creating it
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground');    //success flash message from the connect-flash lib - make sure to display the message in the middleware for flash messages in app.js
    res.redirect(`/campgrounds/${campground._id}`);
};


module.exports.showCampground = async( req,res) => {
    const campgroundID = req.params.id;
    const campground = await Campground.findById(campgroundID).populate({
        path: 'reviews',
        populate: {
            path: 'author'      //populate the author of each review
        }
    }).populate('author');    //.populate(reviews) is to display the reviews
    // what if the campground we want has been deleted, we flash a message and redirect to all campgrounds
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
};


module.exports.renderEditForm = async(req,res) => {
    const campgroundID = req.params.id;
    const campground = await Campground.findById(campgroundID);
    res.render('campgrounds/edit', {campground});
};


module.exports.updateCampground = async(req,res)=>{
    const campgroundID = req.params.id;
    const campground = await Campground.findByIdAndUpdate(campgroundID, {...req.body.campground});
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async(req,res)=>{
    const campgroundID = req.params.id;
    const campground = await Campground.findByIdAndDelete(campgroundID);
    req.flash('success', 'Campground successfully deleted');
    res.redirect('/campgrounds');
};
