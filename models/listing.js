const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Review = require('./review')
const Schema = mongoose.Schema;


const opts = { toJSON: { virtuals: true } };

const ListingSchema = new Schema({
    title: String,
    tagline: String,
    faqs: [{
        faqQuestion: [String],
        faqAnswer: [String]
      }],
    images:[
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    priceRange: String,
    priceFrom: Number,
    priceTo: Number,
    additionalDetails: {
        type: [String],
        select: true
      },
    website: String,
    description: String,
    location: String,
    phone: String,
    createdAt: { type: Date, default: Date.now },
    category: {
        type: String,
        required: true
      },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review'
        }
    ]
}, opts);

ListingSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <div class="map-post">
    <div class="map-post-thumb">
        <a href="/listings/${this._id}">
            <img class="img-fluid" src="${this.images[0].url}" alt="">
        </a>
    </div>
    <div class="map-post-des">
        <div class="map-post-title">
            <h5 class="bc-title bc-title-map"><a href="/listings/${this._id}">${this.title}</a></h5>
        </div>
        <div class="map-post-address">
            <p>${this.location}</p>
        </div>
    </div>
</div>
    `
})

ListingSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        const res = await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
    
})

ListingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Listing', ListingSchema);