const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const openaiRouter = require('./routes/openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(limiter);

app.use('/api/openai', openaiRouter);

const staticPath = path.join(__dirname, '../frontend');
app.use(express.static(staticPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`PUK backend running on http://localhost:${PORT}`);
  });
}

try {
  const functions = require('firebase-functions');
  exports.app = functions.https.onRequest(app);
} catch (error) {
  // firebase-functions is optional for local development.
}
