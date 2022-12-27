const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const CourseSchema = new Schema({
    courseName: String,
    subject: String,
    reviews: [
        {
            type: Schema.Types.ObjectID,
            ref: 'Review'
        }
    ]
});

CourseSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Course', CourseSchema);




