import express from 'express';
import rainwaterRoutes from './rainwater.js';
import waterQualityRoutes from './waterQuality.js';
import adminRoutes from './admin.js';

const router = express.Router();

// Main API routes
router.use('/rainwater', rainwaterRoutes);
router.use('/water-quality', waterQualityRoutes);
router.use('/admin', adminRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: '🌧️ JalSarathi Water Management API',
    version: '1.0.0',
    endpoints: {
      rainwater: '/api/rainwater',
      waterQuality: '/api/water-quality',
      admin: '/api/admin'
    },
    documentation: 'https://github.com/jalsarathi/docs'
  });
});

export default router;