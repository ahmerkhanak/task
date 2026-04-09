const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Upload = require('../models/Upload');
const UploadRow = require('../models/UploadRow');

// Helper: get upload for user or 404
const getUserUpload = async (userId, res) => {
  const upload = await Upload.findOne({ user_id: userId });
  if (!upload) {
    res.status(404).json({ message: 'No data found. Please upload a CSV first.' });
    return null;
  }
  return upload;
};

// GET /api/data/preview - first 15 rows
router.get('/preview', auth, async (req, res) => {
  try {
    const upload = await getUserUpload(req.user.userId, res);
    if (!upload) return;

    const rows = await UploadRow.find({ upload_id: upload._id })
      .limit(15)
      .lean()
      .select('-__v');

    res.json({ rows, filename: upload.filename });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/data/summary - aggregated statistics card
router.get('/summary', auth, async (req, res) => {
  try {
    const upload = await getUserUpload(req.user.userId, res);
    if (!upload) return;

    const rows = await UploadRow.find({ upload_id: upload._id }).lean();

    const totalRows = rows.length;
    const dates = rows.map(r => r.date).filter(Boolean).sort();
    const dateRange = dates.length > 0
      ? { from: dates[0], to: dates[dates.length - 1] }
      : null;

    const uniqueCategories = [...new Set(rows.map(r => r.category).filter(Boolean))];
    const uniqueRegions = [...new Set(rows.map(r => r.region).filter(Boolean))];
    const uniqueProducts = [...new Set(rows.map(r => r.product).filter(Boolean))];

    const totalSales = rows.reduce((sum, r) => sum + (r.sales || 0), 0);
    const totalUnits = rows.reduce((sum, r) => sum + (r.units_sold || 0), 0);
    const avgOrderValue = totalRows > 0 ? totalSales / totalRows : 0;

    const regionSales = {};
    rows.forEach(r => {
      if (r.region) regionSales[r.region] = (regionSales[r.region] || 0) + r.sales;
    });
    const topRegion = Object.entries(regionSales).sort((a, b) => b[1] - a[1])[0];

    res.json({
      totalRows,
      dateRange,
      uniqueCategories,
      uniqueRegions,
      uniqueProducts,
      columns: ['date', 'product', 'category', 'sales', 'units_sold', 'region', 'customer_age'],
      kpis: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalUnits,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        topRegion: topRegion ? topRegion[0] : 'N/A'
      },
      filename: upload.filename,
      uploadedAt: upload.uploaded_at
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
