const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const os = require('os');
const auth = require('../middleware/auth');
const Upload = require('../models/Upload');
const UploadRow = require('../models/UploadRow');

// Store file temporarily in server/uploads/
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// POST /api/upload
router.post('/', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    // Delete any existing upload + rows for this user (single upload policy)
    const existingUpload = await Upload.findOne({ user_id: req.user.userId });
    if (existingUpload) {
      await UploadRow.deleteMany({ upload_id: existingUpload._id });
      await Upload.deleteOne({ _id: existingUpload._id });
    }

    // Create new Upload record
    const newUpload = new Upload({
      user_id: req.user.userId,
      filename: req.file.originalname,
      uploaded_at: new Date()
    });
    await newUpload.save();

    // Parse CSV
    const rows = [];
    const detectedColumns = new Set();

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headers) => {
          headers.forEach(h => detectedColumns.add(h.trim()));
        })
        .on('data', (row) => {
          rows.push({
            upload_id: newUpload._id,
            date: row.date?.trim() || null,
            product: row.product?.trim() || null,
            category: row.category?.trim() || null,
            sales: parseFloat(row.sales) || 0,
            units_sold: parseInt(row.units_sold) || 0,
            region: row.region?.trim() || null,
            customer_age: parseInt(row.customer_age) || null
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Bulk insert all rows
    if (rows.length > 0) {
      await UploadRow.insertMany(rows);
    }

    // Cleanup temp file
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: 'CSV uploaded and processed successfully',
      rowCount: rows.length,
      columns: Array.from(detectedColumns),
      uploadId: newUpload._id
    });
  } catch (err) {
    // Cleanup on error
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to process CSV: ' + err.message });
  }
});

module.exports = router;
