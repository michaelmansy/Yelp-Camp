const express = require('express');
const router = express.Router();

// require same stuff from app.js so we dont get errors
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Joi = require('joi');    //library to handle server side errors
const Campground = require('../models/campground');    //contains the schema model 

const isLoggedIn = require('../middleware');      //middleware bta3 el login lazem tekon logged in 3shan t access routes mo3ayana


// requiring the controllers
const campgrounds = require('../controllers/campgrounds');
const campground = require('../models/campground');

// me7tagin el meddleware bta3 el campground validatio bardo
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

// middleware isAuthour  = is this the author of the campground
const isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You dont have permisssion to do this');
        return res.redirect(`/campground/${id}`);
    }
}

// di kolaha routes el campground el kanet fel app.js


// campground index
router.get('/', campgrounds.index);

// route to create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// route to where this form is submitted
router.post('/', isLoggedIn, validateCampground ,catchAsync(campgrounds.createCampground));


// route to show the picked campground
router.get('/:id', campgrounds.showCampground);

// route to serve the form that will be used to edit/update campgrounds
router.get('/:id/edit', campgrounds.renderEditForm);


// ideally i should modify this to make sure the owner is the only one who can edit the campground 
// 3shan momken wa7ed ye5oshelak men el postman maslan ye3mel keda bas ana kabart dmaghy (video: 546)
router.put('/:id',validateCampground , campgrounds.updateCampground);


router.delete('/:id', campgrounds.deleteCampground);



// fancy way for routing; group the ones that have the same path together (here the ones for '/' for example)

// router.route('/')
//     .get('/', campgrounds.index);
//     .post('/', isLoggedIn, validateCampground ,catchAsync(campgrounds.createCampground));

// router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// router.route('/:id')
//     .get(campgrounds.showCampground)
//     .put(validateCampground , campgrounds.updateCampground)
//     .delete(campgrounds.deleteCampground);



module.exports = router;