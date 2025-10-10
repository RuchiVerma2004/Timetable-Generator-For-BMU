const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Student = require('../models/Student');

const router = express.Router();

// All routes protected
router.use(protect);

// Get student profile
router.get('/profile', authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('coursesEnrolled.courseId');
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get student timetable
router.get('/timetable', authorize('student'), async (req, res) => {
  try {
    // This will be implemented with timetable logic
    res.status(200).json({
      success: true,
      data: {
        message: 'Student timetable endpoint - to be implemented'
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