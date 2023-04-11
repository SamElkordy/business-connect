const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const Fuse = require('fuse.js');



const categories = ['Arts', 'Automotive', 'Beauty', 'Health', 'Restaurant', 'Services', 'Shopping']

module.exports.home = async (req, res) => {
  let search = req.query.search || '';

  // Find all listings or filter by search query
  let listings;
  if (search) {
    const options = {
      keys: ['title', 'location'],
    };
    const fuse = new Fuse(await Listing.find(query), options);
    const searchResults = fuse.search(search);
    listings = await Listing.paginate(
      { _id: { $in: searchResults.map(result => result.item._id) } },
      { page: req.query.page || 1, limit: 10, sort: '-_id',
      populate: {
        path: 'reviews',
        options: { sort: { createdAt: -1 } },
      } }
    );
  } else {
    listings = await Listing.paginate(
      {
        page: req.query.page || 1,
        limit: 10,
        sort: '-_id',
        populate: {
          path: 'reviews',
          options: { sort: { createdAt: -1 } },
        },
      }
    );
  }

  listings.page = Number(listings.page);
  let totalPages = listings.totalPages;
  let currentPage = listings.page;
  let startPage;
  let endPage;

  if (totalPages <= 10) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  }

 // Return an array of listing titles for autocomplete suggestions
if (req.query.autocomplete) {
  const options = {
    keys: ['title', 'location'],
    threshold: 0.4
  };
  const fuse = new Fuse(await Listing.find(query), options);
  const searchResults = fuse.search(req.query.autocomplete);
  const suggestions = searchResults.map(result => result.item.title);
  console.log(suggestions)
  return res.json(suggestions);
}

const topListings = await Listing.find()
.sort({ 'reviews.rating': -1 })
.limit(3)
.populate('reviews')
.exec();

  // If search query is not present, render the index view with default data
  if (!search) {
    return res.render('home', {
      listings,
      startPage,
      endPage,
      currentPage,
      totalPages,
      topListings,
      search // pass search as a variable to the view
    });
  }

  // Render the index view with search results and data
  return res.render('home', {
    listings,
    startPage,
    endPage,
    currentPage,
    totalPages,
    search, // pass search as a variable to the view
    suggestions: [] // pass an empty suggestions array to the view
  });
}

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let search = req.query.search || '';

  // Find all listings or filter by category
  const query = category ? { category: { $in: category.split(',') } } : {};

  // Find all listings or filter by search query
  let listings;
  if (search) {
    const options = {
      keys: ['title', 'location'],
    };
    const fuse = new Fuse(await Listing.find(query), options);
    const searchResults = fuse.search(search);
    listings = await Listing.paginate(
      { _id: { $in: searchResults.map(result => result.item._id) } },
      { page: req.query.page || 1, limit: 10, sort: '-_id',
      populate: {
        path: 'reviews',
        options: { sort: { createdAt: -1 } },
      } }
    );
  } else {
    listings = await Listing.paginate(
      query,
      {
        page: req.query.page || 1,
        limit: 10,
        sort: '-_id',
        populate: {
          path: 'reviews',
          options: { sort: { createdAt: -1 } },
        },
      }
    );
  }

  listings.page = Number(listings.page);
  let totalPages = listings.totalPages;
  let currentPage = listings.page;
  let startPage;
  let endPage;

  if (totalPages <= 10) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  }

 // Return an array of listing titles for autocomplete suggestions
if (req.query.autocomplete) {
  const options = {
    keys: ['title', 'location'],
    threshold: 0.4
  };
  const fuse = new Fuse(await Listing.find(query), options);
  const searchResults = fuse.search(req.query.autocomplete);
  const suggestions = searchResults.map(result => result.item.title);
  console.log(suggestions)
  return res.json(suggestions);
}

  // If search query is not present, render the index view with default data
  if (!search) {
    return res.render('listings/index', {
      listings,
      category,
      categories,
      startPage,
      endPage,
      currentPage,
      totalPages,
      search // pass search as a variable to the view
    });
  }

  // Render the index view with search results and data
  return res.render('listings/index', {
    listings,
    category,
    categories,
    startPage,
    endPage,
    currentPage,
    totalPages,
    search, // pass search as a variable to the view
    suggestions: [] // pass an empty suggestions array to the view
  });
};



module.exports.renderNewForm = (req, res) => {
    res.render('listings/new', { categories });
}

module.exports.createListing = async (req, res) => {
        const geoData = await geocoder.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()
    const listing = new Listing(req.body.listing);
    listing.geometry = geoData.body.features[0].geometry;
    listing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    listing.author = req.user._id;
    await listing.save();
    console.log(listing)
    req.flash('success', 'Successfully made a new listing');
    res.redirect(`/listings/${listing._id}`);
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing =  await Listing.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing =  await Listing.findById(id);
    if(!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing, categories });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    listing.images.push(...imgs);
    await listing.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await listing.updateOne({ $pull: { images: { filename: {$in: req.body.deleteImages} } } });
    }
    req.flash('success', 'Successfully updated listing');
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted listing');
    res.redirect('/listings')
};


