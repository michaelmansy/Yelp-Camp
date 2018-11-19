var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");  //index.js is required this way for the middleware stuff


//=================================
//COMMENTS ROUTES
//=================================
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn,function(req,res){
   //find campground by id
   Campground.findById(req.params.id, function(err,campground){
      if(err){
          console.log(err);
      } else{
          res.render("comments/new", {campground : campground});
      }
   });
});



//set upthe post route where we can submit the form to
//four steps with this route:
//1) look up campground using the id
//2) create a new comment
//3) connect the new comment to the campground
//4) redirect to campground show page

router.post("/campgrounds/:id/comments", middleware.isLoggedIn,function(req,res){
    //lookup the campground using the id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                //  add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //   save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
               }
            });
        }
    });
});


// comments edit route
// campground.id is already defines to be the id of the campground not the id of the comment
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership ,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id , comment: foundComment});
        }    
    });
});


// comments update route using update route as a put request
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else{
          //redirect back to the show page (we need the id of the campground)
          res.redirect("/campgrounds/" + req.params.id);
      }
   }); 
});




//comment destroy route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       }else{
           req.flash("success", "your comment has been successfully deleted");
           //go back to the show page (we need the campground's id to go back there)
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});






module.exports = router;