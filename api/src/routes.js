const express = require('express');
const router = express.Router();

const apiRouter = require('./Routes/APIRoutes');

router.use(apiRouter);

module.exports = router; 