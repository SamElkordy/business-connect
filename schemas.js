const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

const faqSchema = Joi.object({
    faqQuestion: Joi.string().required(),
    faqAnswer: Joi.string().required()
});

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().escapeHTML(),
        tagline: Joi.string().escapeHTML(),
        // additionalDetails: Joi.boolean(),
        priceRange: Joi.string().required().escapeHTML(),
        priceFrom: Joi.number().min(0),
        priceTo: Joi.number().min(0),
        website: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        // image: Joi.string().required(),
        phone: Joi.string().required().escapeHTML(),
        category: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        faqs: Joi.array().items(faqSchema),
        additionalDetails: Joi.array().items(Joi.string()).required()
        
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        title: Joi.string().required().escapeHTML(),
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})
