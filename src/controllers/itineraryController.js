const Itinerary = require('../models/Itinerary');
const redis = require('redis');
const mongoose = require('mongoose');
const client = require('../redis'); 

// ----------------------
// Redis client setup
// ----------------------

// Cache expiry in seconds
const CACHE_EXPIRY = 120;

// =========================
// CREATE ITINERARY
// =========================
exports.createItinerary = async (req, res) => {
  try {
    const itinerary = new Itinerary({ ...req.body, userId: req.user.id });
    await itinerary.save();

    // Cache the newly created itinerary
    if (client) await client.setEx(itinerary._id.toString(), CACHE_EXPIRY, JSON.stringify(itinerary));

    res.status(201).json(itinerary);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =========================
// GET ALL ITINERARIES
// =========================
exports.getItineraries = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', destination } = req.query;
    const filter = { userId: req.user.id };

    if (destination) {
      // Case-insensitive search
      filter.destination = { $regex: new RegExp(destination, 'i') };
    }

    // Generate a cache key based on query
    const cacheKey = `itineraries:${req.user.id}:${page}:${limit}:${sort}:${destination || ''}`;
    if (client) {
      const cached = await client.get(cacheKey);
      if (cached) return res.status(200).json(JSON.parse(cached));
    }

    const itineraries = await Itinerary.find(filter)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Cache result for 120 seconds
    if (client) await client.setEx(cacheKey, CACHE_EXPIRY, JSON.stringify(itineraries));

    res.status(200).json(itineraries);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =========================
// GET SINGLE ITINERARY
// =========================
exports.getItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid itinerary ID' });
    }

    if (client) {
      const cached = await client.get(`itinerary:${id}`);
      if (cached) return res.status(200).json(JSON.parse(cached));
    }

    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

    if (client) await client.setEx(`itinerary:${id}`, CACHE_EXPIRY, JSON.stringify(itinerary));

    res.status(200).json(itinerary);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =========================
// UPDATE ITINERARY
// =========================
exports.updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid itinerary ID' });
    }

    const updated = await Itinerary.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Itinerary not found' });

    if (client) await client.setEx(`itinerary:${id}`, CACHE_EXPIRY, JSON.stringify(updated));

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =========================
// DELETE ITINERARY
// =========================
exports.deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid itinerary ID' });
    }

    const deleted = await Itinerary.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Itinerary not found' });

    if (client) {
      await client.del(`itinerary:${id}`);
      // Optional: flush all cached "all itineraries" keys
      const keys = await client.keys(`itineraries:${req.user.id}:*`);
      if (keys.length) await client.del(keys);
    }

    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// =========================
// SHARE ITINERARY
// =========================
exports.shareItinerary = async (req, res) => {
  try {
    const { shareableId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(shareableId)) {
      return res.status(400).json({ message: 'Invalid itinerary ID' });
    }

    const itinerary = await Itinerary.findById(shareableId).select('-userId');
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

    res.status(200).json(itinerary);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
