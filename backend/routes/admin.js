const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createDriverSchema, createBusSchema, generateRouteSchema, createStopSchema, assignTripSchema } = require('../validators/adminValidator');

// All routes require admin auth
router.use(adminAuth);

// Drivers
router.get('/drivers', adminController.getDrivers);
router.post('/drivers', validate(createDriverSchema), adminController.createDriver);
router.put('/drivers/:id', adminController.updateDriver);
router.delete('/drivers/:id', adminController.deleteDriver);

// Buses
router.get('/buses', adminController.getBuses);
router.post('/buses', validate(createBusSchema), adminController.createBus);
router.put('/buses/:id', adminController.updateBus);
router.delete('/buses/:id', adminController.deleteBus);

// Routes
router.get('/routes', adminController.getRoutes);
router.post('/routes/generate', validate(generateRouteSchema), adminController.generateRoute);
router.put('/routes/:id', adminController.updateRoute);
router.delete('/routes/:id', adminController.deleteRoute);

// Stops within a route
router.post('/routes/:route_id/stops', validate(createStopSchema), adminController.addStop);
router.get('/routes/:route_id/stops', adminController.getStops);
router.delete('/stops/:id', adminController.deleteStop);

// Trip Assignments
router.get('/trips', adminController.getTrips);
router.post('/trips', validate(assignTripSchema), adminController.assignTrip);
router.put('/trips/:id/cancel', adminController.cancelTrip);

// Dashboard
router.get('/dashboard', adminController.dashboardStats);
router.get('/trips/recent', adminController.recentTrips);

module.exports = router;