const express = require('express');
const cors = require('cors');
const locationRoutes = require('./routes/location.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/locations', locationRoutes);

module.exports = app;
