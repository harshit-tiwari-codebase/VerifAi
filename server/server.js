// server.js - Express entrypoint for the backend
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/ping', (req, res) => {
	res.json({ pong: true });
});

// Serve static client files in production if present
const clientDist = path.join(__dirname, '..', 'client', 'src');
app.use(express.static(clientDist));

app.get('/', (req, res) => {
	res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(port, () => {
	console.log(`VerifAI server listening on port ${port}`);
});
