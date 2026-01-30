const locationService = require('../services/location.service');

const getLocations = async (req, res) => {
    try {
        const locations = await locationService.getAllLocations();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations' });
    }
};

const getLocation = async (req, res) => {
    try {
        const location = await locationService.getLocationById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json(location);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching location' });
    }
};

module.exports = {
    getLocations,
    getLocation
};
