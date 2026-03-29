const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle image conversion
app.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const format = req.body.format?.toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Use jpg or png' });
    }

    let converted;
    if (format === 'jpg' || format === 'jpeg') {
      converted = await sharp(req.file.buffer).jpeg({ quality: 90 }).toBuffer();
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="converted.jpg"');
    } else {
      converted = await sharp(req.file.buffer).png().toBuffer();
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="converted.png"');
    }

    res.send(converted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Image converter running on http://localhost:${PORT}`);
});
