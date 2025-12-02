// Load environment variables FIRST before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration - allow all origins and methods
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Gemini Brand Mention Checker API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
