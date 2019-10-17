const router = require("express").Router();

// Routes for API and Authentication
const authRoutes = require("./auth");
const apiRoutes = require("./api");

router.use('/auth', authRoutes);
router.use('/api', apiRoutes);

module.exports = router;
