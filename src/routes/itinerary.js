const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  shareItinerary
} = require('../controllers/itineraryController');

router.post('/', auth, createItinerary);
router.get('/', auth, getItineraries);
router.get('/:id', auth, getItinerary);
router.put('/:id', auth, updateItinerary);
router.delete('/:id', auth, deleteItinerary);
router.get('/share/:shareableId', shareItinerary);

module.exports = router;
