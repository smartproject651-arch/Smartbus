const router = require('express').Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { adminLoginSchema, driverLoginSchema } = require('../validators/authValidator');

router.post('/admin/login', validate(adminLoginSchema), authController.adminLogin);
router.post('/driver/login', validate(driverLoginSchema), authController.driverLogin);

module.exports = router;