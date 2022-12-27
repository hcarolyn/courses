const express = require('express');
const Course = require('../models/course')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas.js')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const router = express.Router({ mergeParams: true })

router.post('/', catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    course.reviews.push(review);
    await review.save();
    await course.save();
    req.flash('success', 'Posted new review!');
    res.redirect(`/courses/${course._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "Not the right user!");
        return res.redirect(`/courses/${id}`)
    }
    await Course.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Edited review!');
    res.redirect(`/courses/${id}`);
}))


module.exports = router;