import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import requestIp from "request-ip";


// NEW FUNCTION - For image uploads
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(errorHandler(400, 'No images uploaded'));
    }
    
    const imageUrls = req.files.map(file => file.path);
    res.status(200).json({ 
      success: true, 
      imageUrls 
    });
  } catch (error) {
    next(error);
  }
};

// Existing functions remain the same
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// export const getListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return next(errorHandler(404, 'Listing not found!'));
//     }
//      // 🔥 Increase views (simple method)
//     listing.views = (listing.views || 0) + 1;
//     await listing.save();
//     res.status(200).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };
export const getListing = async (req, res) => {
  try {
    const clientIp = requestIp.getClientIp(req);

    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ success: false });

    const viewedAlready = listing.viewLogs?.some(
      log => log.ip === clientIp && Date.now() - log.date < 24 * 60 * 60 * 1000
    );

    if (!viewedAlready) {
      listing.views++;
      listing.viewLogs.push({ ip: clientIp, date: Date.now() });
      await listing.save();
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};