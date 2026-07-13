const router = require('express').Router();
const passengerController = require('../controllers/passengerController');

router.get('/bus/:busNumber', passengerController.searchByBusNumber);
router.get('/nearby', passengerController.nearbyBuses);
router.get('/track/:tripId', passengerController.trackBus);
router.get('/search', passengerController.searchRoutes);

module.exports = router;