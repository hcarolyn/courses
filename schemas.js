const Joi = require('joi');

module.exports.courseSchema = Joi.object({
    course: Joi.object({
        courseName: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        professor: Joi.string().required(),
        difficulty: Joi.number().required().min(1).max(5)
    }).required()
})