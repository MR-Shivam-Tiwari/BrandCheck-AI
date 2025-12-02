// Test CORS configuration
const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working correctly!',
    body: req.body
  });
});

app.get('/', (req, res) => {
  res.send('CORS Test Server - POST to /api/test');
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`\n CORS Test Server running on http://localhost:${PORT}`);
  console.log(`📝 Test endpoint: POST http://localhost:${PORT}/api/test\n`);
});
