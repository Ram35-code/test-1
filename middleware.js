const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/Express.Error.js");
const {listingSchema} = require("./schema.js");
 

module.exports.isLoggedIn = (req, res, next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl
    req.flash("error", "You must be logged in to create listing!")
    return res.redirect("/login");
  }
  next();
};


module.exports.saveRedirectUrl = (req,res, next)=>{
  if(req.session.redirectUrl){  
    res.locals.redirectUrl = req.session.redirectUrl;
  };
  next();
};

module.exports.isOwner = async (req, res, next)=>{
  let {id} = req.params;
   let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
  req.flash("error", "You are not a owner this listing.");
  return res.redirect(`/listings/${id}`);
 }
 next();
}

module.exports.validateList = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(404, error)
  }else{
    next();
  };
};

module.exports.isReview = async (req, res, next)=>{
  let {id, reviewId} = req.params;
   let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
  req.flash("error", "You are not a author this Review.");
  return res.redirect(`/listings/${id}`);
 }
 next();
}
