const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { courseSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware')

const ExpressError = require('../utils/ExpressError');
const Course = require('../models/course');

const validateCourse = (req, res, next) => {
    const { error } = courseSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', { courses })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('courses/new');
})

router.post('/', isLoggedIn, catchAsync(async (req, res, next) => {
    const course = new Course(req.body.course);
    await course.save();
    req.flash('success', 'Successfully made a new course!');
    res.redirect(`/courses/${course._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const course = await Course.findById(req.params.id).populate('reviews');
    if (!course) {
        req.flash('error', 'Cannot find that course!');
        return res.redirect('/courses');
    }
    res.render('courses/show', { course });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id)
    if (!course) {
        req.flash('error', 'Cannot find that course!');
        return res.redirect('/courses');
    }
    res.render('courses/edit', { course });
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated course!');
    res.redirect(`/courses/${course._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted course')
    res.redirect('/courses');
}));

module.exports = router;