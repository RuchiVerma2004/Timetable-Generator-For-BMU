const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected and only for admins
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        totalStudents: 0,
        totalProfessors: 0,
        totalCourses: 0,
        activeTimetables: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;