const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/ping', (req, res) => res.json({ status: 'ok' }));

// TODO: Mount routes (auth, items, etc)

module.exports = app;
