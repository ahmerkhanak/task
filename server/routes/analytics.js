const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Upload = require('../models/Upload');
const UploadRow = require('../models/UploadRow');
// CORRECTED IMPORT:
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateWithFallback(prompt) {
  // Use the model string directly
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  try {
    console.log(`[Gemini] Attempting connection with: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // CORRECTED METHOD CALL:
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error(`[Gemini Error]: ${err.message}`);
    throw err;
  }
}

// Helper: get upload for user
const getUserUpload = async (userId, res) => {
  const upload = await Upload.findOne({ user_id: userId });
  if (!upload) {
    res.status(404).json({ message: 'No data found. Please upload a CSV first.' });
    return null;
  }
  return upload;
};

// GET /api/analytics/charts
router.get('/charts', auth, async (req, res) => {
  try {
    const upload = await getUserUpload(req.user.userId, res);
    if (!upload) return;

    const rows = await UploadRow.find({ upload_id: upload._id }).lean();

    const salesByDate = {};
    const salesByRegion = {};
    const salesByCategory = {};

    rows.forEach(row => {
      if (row.date) {
        // Normalize date to YYYY-MM-DD
        const d = new Date(row.date).toISOString().split('T')[0];
        salesByDate[d] = (salesByDate[d] || 0) + (row.sales || 0);
      }
      if (row.region) salesByRegion[row.region] = (salesByRegion[row.region] || 0) + (row.sales || 0);
      if (row.category) salesByCategory[row.category] = (salesByCategory[row.category] || 0) + (row.sales || 0);
    });

    const trendData = Object.entries(salesByDate)
      .map(([date, sales]) => ({ date, sales: Number(sales.toFixed(2)) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const regionData = Object.entries(salesByRegion)
      .map(([region, sales]) => ({ region, sales: Number(sales.toFixed(2)) }))
      .sort((a, b) => b.sales - a.sales);

    const categoryData = Object.entries(salesByCategory)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));

    const totalSales = rows.reduce((sum, r) => sum + (r.sales || 0), 0);
    const totalUnits = rows.reduce((sum, r) => sum + (r.units_sold || 0), 0);
    const avgOrderValue = rows.length > 0 ? totalSales / rows.length : 0;

    const sortedRegions = Object.entries(salesByRegion).sort((a, b) => b[1] - a[1]);

    res.json({
      trendData,
      regionData,
      categoryData,
      kpis: {
        totalSales: Number(totalSales.toFixed(2)),
        totalUnits,
        avgOrderValue: Number(avgOrderValue.toFixed(2)),
        topRegion: sortedRegions.length > 0 ? sortedRegions[0][0] : 'N/A'
      }
    });
  } catch (err) {
    console.error('Charts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/analytics/insights
router.post('/insights', auth, async (req, res) => {
  try {
    const upload = await getUserUpload(req.user.userId, res);
    if (!upload) return;

    const rows = await UploadRow.find({ upload_id: upload._id }).lean();
    if (rows.length === 0) return res.status(400).json({ message: 'No data to analyse' });

    // Aggregates for Prompt
    const totalSales = rows.reduce((sum, r) => sum + (r.sales || 0), 0);
    const totalUnits = rows.reduce((sum, r) => sum + (r.units_sold || 0), 0);
    const salesByRegion = {};
    const salesByProduct = {};

    rows.forEach(row => {
      if (row.region) salesByRegion[row.region] = (salesByRegion[row.region] || 0) + (row.sales || 0);
      if (row.product) salesByProduct[row.product] = (salesByProduct[row.product] || 0) + (row.sales || 0);
    });

    const topRegion = Object.entries(salesByRegion).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];
    const topProduct = Object.entries(salesByProduct).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

    const prompt = `Review this sales data:
    Total Revenue: $${totalSales.toFixed(2)}
    Units Sold: ${totalUnits}
    Top Region: ${topRegion[0]} ($${topRegion[1].toFixed(0)})
    Top Product: ${topProduct[0]} ($${topProduct[1].toFixed(0)})

    Provide 3 concise, actionable business insights formatted with bold titles.`;

    const insights = await generateWithFallback(prompt);
    res.json({ insights });

  } catch (err) {
    console.error('Insights error:', err);
    res.status(500).json({ message: 'AI Error: ' + err.message });
  }
});

module.exports = router;