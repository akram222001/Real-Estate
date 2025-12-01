import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },

    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: "India" },

    category: { type: String, required: true }, 
    area: { type: Number, required: true }, 
    builtYear: { type: Number },

    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number },
    offer: { type: Boolean, default: false },

    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    parking: { type: Boolean, required: true },
    furnished: { type: Boolean, required: true },

    amenities: { type: [String], default: [] }, // Pool / Gym / lift etc.

    nearbyPlaces: {
      type: [
        {
          place: String,
          distance: String,
        },
      ],
      default: [],
    },

    imageUrls: { type: Array, required: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    status: { type: String, default: "Rechable" },
    viewLogs: [
      {
        ip: String,
        date: Date,
      },
    ],
    type: { type: String, required: true },
    userRef: { type: String, required: true },
  },
  { timestamps: true }
);


const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
