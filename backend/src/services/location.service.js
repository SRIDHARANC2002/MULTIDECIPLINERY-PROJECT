const { readData } = require('../utils/file.utils');

const getAllLocations = async () => {
    const locations = await readData();
    return locations;
};

const getLocationById = async (id) => {
    const locations = await readData();
    return locations.find(loc => loc.id === parseInt(id));
};

module.exports = {
    getAllLocations,
    getLocationById
};
