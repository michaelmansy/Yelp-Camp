// this file will serve as a middleware for logged in users 
// so u can only make a review or create a new campground only if ur logged in; this middleware will be called in these routes 
// function isAuthenticated() is coming by default from passport

const isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

// is the author of the review
// const isReviewAuthor = async(req,res,next) => {
//     const {id, reviewId} = req.params;
//     const review = await Review.findById(reviewId);
//     if(!campground.author.equals(req.user._id)){
//         req.flash('error', 'No permissions');
//         return res.redirect('/campground/${id}');
//     }
//     next();
// }

module.exports = isLoggedIn;