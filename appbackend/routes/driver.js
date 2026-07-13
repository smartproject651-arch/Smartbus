const router = require('express').Router();
const driverController = require('../controllers/driverController');
const { driverAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { startTripSchema, updateLocationSchema, reportIssueSchema, emergencySchema } = require('../validators/driverValidator');

router.use(driverAuth);

router.get('/trip', driverController.getAssignedTrip);
router.post('/start-trip', validate(startTripSchema), driverController.startTrip);
router.post('/end-trip', validate(startTripSchema), driverController.endTrip);
router.post('/update-location', validate(updateLocationSchema), driverController.updateLocation);
router.post('/report-issue', validate(reportIssueSchema), driverController.reportIssue);
router.post('/emergency', validate(emergencySchema), driverController.emergency);

module.exports = router;