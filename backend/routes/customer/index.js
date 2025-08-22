const express = require('express');
const router = express.Router();

// const userRoutes = require("./api/user"); // More specific import
const { authenticateToken, authorize } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorize(['customer']));

// router.use('/user', userRoutes);

module.exports = router;