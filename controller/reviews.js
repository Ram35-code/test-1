const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req,res)=>{
  console.log(req.params.id) 
  let listing = await Listing.findById(req.params.id);
  let newRaview = new Review(req.body.review);
  newRaview.author = req.user._id;
  console.log(newRaview);
  listing.reviews.push(newRaview);

  await newRaview.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyListing = async(req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};