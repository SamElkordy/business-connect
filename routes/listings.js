const express = require('express');
const router = express.Router();
const listings = require('../controllers/listings');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateListing, isAuthor } = require('../middleware')
const multer  = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(listings.index))
    .post(isLoggedIn, upload.array('image'), validateListing, catchAsync(listings.createListing));


router.get('/new', isLoggedIn, listings.renderNewForm);

router.route('/:id')
    .get(catchAsync(listings.showListing))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateListing, catchAsync(listings.updateListing))
    .delete(isLoggedIn, isAuthor, catchAsync(listings.deleteListing));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(listings.renderEditForm));

module.exports = router;

