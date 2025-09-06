const Itinerary = require('../models/Itinerary');
const redis = require('redis');
const mongoose = require('mongoose');

// Redis client setup (optional)
let client;
if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
    client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
    client.connect().then(() => console.log('✅ Redis connected')).catch(err => console.log('Redis error:', err));
}

// =========================
// CREATE ITINERARY
// =========================
exports.createItinerary = async (req, res) => {
    try {
        const itinerary = new Itinerary({ ...req.body, userId: req.user.id });
        await itinerary.save();
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
        if (destination) filter.destination = destination;

        const itineraries = await Itinerary.find(filter)
            .sort({ [sort]: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

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

        // Check Redis cache
        if (client) {
            const cached = await client.get(id);
            if (cached) return res.status(200).json(JSON.parse(cached));
        }

        const itinerary = await Itinerary.findById(id);
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

        // Cache in Redis for 5 minutes
        if (client) await client.setEx(id, 300, JSON.stringify(itinerary));

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

        // Update Redis cache
        if (client) await client.setEx(id, 300, JSON.stringify(updated));

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

        // Remove from Redis cache
        if (client) await client.del(id);

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
