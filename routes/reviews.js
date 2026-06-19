const express = require('express');
const router = express.Router({mergeParams: true});   //this mergeParams only needed here 3shan el id bta3 el path

// require same stuff from app.js so we dont get errors
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Joi = require('joi');   //library to handle server side errors

const Campground = require('../models/campground');    //contains the schema model 
const Review = require('../models/review');   //contains the review model

const reviews = require('../controllers/reviews');   //require the reviews controller

const isLoggedIn = require('../middleware');      //middleware bta3 el login lazem tekon logged in 3shan t access routes mo3ayana



// is the author of the review (should be in the middleware file)
const isReviewAuthor = async(req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'No permissions');
        return res.redirect('/campground/${id}');
    }
    next();
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





// route for the reviews
router.post('/', isLoggedIn,validateReview, catchAsync(reviews.creatReview));   //route to create the review; we need to validate the review before creating it so we add the validateReview middleware

// route to delete the review from the database; mongo has a specfic way using $pull
router.delete('/:reviewId',isLoggedIn, catchAsync(reviews.deleteReview));   //route to delete the review; we need to make sure the user is logged in before deleting the review so we add the isLoggedIn middleware; we also need to make sure the user is the author of the review before deleting it so we add the isReviewAuthor middleware



module.exports = router;