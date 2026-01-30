const API_URL = 'http://localhost:5000/api/locations';

const getLocations = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
};

export default {
    getLocations
};
