const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/convert', upload.single('image'), async (req, res) => {
  try {
    console.log('Request received for conversion');
    console.log('File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'none');
    console.log('Query format:', req.query.format);

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const format = (req.query.format || 'png').toLowerCase();
    console.log('Target format:', format);

    if (!['jpg', 'jpeg', 'png'].includes(format)) {
      console.log('Invalid format requested');
      return res.status(400).json({ error: 'Invalid format. Use jpg or png' });
    }

    let converted;
    try {
      const image = sharp(req.file.buffer);

      if (format === 'jpg' || format === 'jpeg') {
        console.log('Converting to JPEG...');
        converted = await image.jpeg({ quality: 90 }).toBuffer();
        res.type('image/jpeg');
      } else {
        console.log('Converting to PNG...');
        converted = await image.png().toBuffer();
        res.type('image/png');
      }

      console.log('Conversion successful, sending', converted.length, 'bytes');
      res.send(converted);
    } catch (sharpError) {
      console.error('Sharp conversion error:', sharpError.message);
      throw sharpError;
    }
  } catch (error) {
    console.error('Conversion error:', error.message, error.stack);
    res.status(500).json({ error: 'Conversion failed: ' + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Image converter running on http://localhost:${PORT}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Image converter running on http://localhost:${PORT}`);
});
