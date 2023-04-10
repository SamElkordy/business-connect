const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    title: String,
    body: String,
    rating: {
        // Setting the field type
        type: Number,
        // Making the star rating required
        required: "Please provide a rating (1-5 stars).",
        // Defining min and max values
        min: 1,
        max: 5,
        // Adding validation to see if the entry is an integer
        validate: {
            // validator accepts a function definition which it uses for validation
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value."
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Review', reviewSchema);