var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");  //index.js is required this way for the middleware stuff

//INDEX----show all campgrounds
//setting the campgrounds route which shows all our campgrounds
router.get("/campgrounds", function(req,res){
    //get all campgrounds from our DB
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/campgrounds", {campgrounds : allCampgrounds});
        }
    });
});
``

// CREATE------add new campground to the database
//setup a post route for the form to submit a new campground
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name , image:image, price:price, description:description, author: author};
    //create a new campground and save it to the db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else {
            
            res.redirect("/campgrounds");
        }
    });
});


//NEW-------show form to create new campground
//setup a route to render the form
//el route da yewadik 3al form w t submit yewadik 3al app.post("/campgrounds")
router.get("/campgrounds/new", middleware.isLoggedIn,function(req, res){
    res.render("campgrounds/new");
});



//adding a new route to show more info about each campground
router.get("/campgrounds/:id", function(req,res){
    //find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
    }else{
        //printing the comments with each campground
        console.log(foundCampground);
        //render the show template with that campground
        res.render("campgrounds/show", {campground : foundCampground})
    }
    });
});


// we need a form to edit and this form has to redirect somewhere
// which is the update route

// EDIT CAMPGROUND ROUTE
// added stuff: check if user logged in and does he own the campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,function(req, res) {
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                //do something
            }else{
                res.render("campgrounds/edit",{campground:foundCampground});

            }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership ,function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
          res.redirect("/campgrounds");
      } else{
           res.redirect(`/campgrounds/${req.params.id}`); 
        // res.redirect("/campgrounds/" + req.params.id);
      }
    });
});

// UPDATE CAMPGROUND ROUTE
// router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
//     // find and update the correct campground
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//       if(err){
//           res.redirect("/campgrounds");
//       } else {
//           //redirect somewhere(show page)
//           res.redirect("/campgrounds/" + req.params.id);
//       }
//     });
// });


// remember; we have to create a form in the show.ejs to delete
// DESTROY CAMPGROUND - ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership ,function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds"); 
      } else{
          res.redirect("/campgrounds");
      }
  });
});


module.exports = router;