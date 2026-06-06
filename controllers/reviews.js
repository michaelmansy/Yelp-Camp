const Campground = require('../models/campground');    //contains the schema model 
const Review = require('../models/review');   //contains the review model

module.exports.creatReview = async(req,res)=>{
    //grab the campground ID
    const campgroundID = req.params.id;
    const campground = await Campground.findById(campgroundID);
    // create the new review
    const review = new Review(req.body.review);
    //associate the review with the current user
    review.author = req.user._id;
    // associate the review to the campground; reviews was added to the campround model
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Your review has been added');
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.deleteReview = async(req,res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review has been deleted');
    res.redirect(`/campgrounds/${id}`);
}