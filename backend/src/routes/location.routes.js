const express = require('express');
const locationController = require('../controllers/location.controller');

const router = express.Router();

router.get('/', locationController.getLocations);
router.get('/:id', locationController.getLocation);

module.exports = router;
