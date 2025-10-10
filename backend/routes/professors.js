const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');

const router = express.Router();

// All routes protected
router.use(protect);
router.use(authorize('professor'));

// Get professor profile
router.get('/profile', async (req, res) => {
  try {
    const professor = await Professor.findOne({ userId: req.user._id })
      .populate('coursesTeaching.courseId')
      .populate('coursesTeaching.courseId.professorId');

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: professor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get professor's teaching schedule
router.get('/schedule', async (req, res) => {
  try {
    const professor = await Professor.findOne({ userId: req.user._id });
    
    // Get current timetable for professor
    const timetable = await Timetable.findOne({
      'schedule.slots.professorId': professor._id,
      isActive: true
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'No active timetable found'
      });
    }

    // Filter schedule for this professor only
    const professorSchedule = timetable.schedule.map(daySchedule => ({
      day: daySchedule.day,
      slots: daySchedule.slots.filter(slot => 
        slot.professorId && slot.professorId.toString() === professor._id.toString()
      )
    })).filter(daySchedule => daySchedule.slots.length > 0);

    res.status(200).json({
      success: true,
      data: professorSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get courses taught by professor
router.get('/courses', async (req, res) => {
  try {
    const professor = await Professor.findOne({ userId: req.user._id })
      .populate('coursesTeaching.courseId');

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: professor.coursesTeaching
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mark attendance for a course
router.post('/attendance/mark', async (req, res) => {
  try {
    const { courseId, studentId, date, status, remarks } = req.body;
    const professor = await Professor.findOne({ userId: req.user._id });

    // Check if professor teaches this course
    const teachesCourse = professor.coursesTeaching.some(
      course => course.courseId && course.courseId.toString() === courseId
    );

    if (!teachesCourse) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to mark attendance for this course'
      });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      studentId,
      courseId,
      date: new Date(date),
      status,
      markedBy: req.user._id,
      session: 'morning', // You can make this dynamic
      remarks
    });

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get attendance for a course
router.get('/attendance/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const professor = await Professor.findOne({ userId: req.user._id });

    // Check if professor teaches this course
    const teachesCourse = professor.coursesTeaching.some(
      course => course.courseId && course.courseId.toString() === courseId
    );

    if (!teachesCourse) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view attendance for this course'
      });
    }

    const attendance = await Attendance.find({ courseId })
      .populate('studentId', 'studentId profile.firstName profile.lastName')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update professor availability
router.put('/availability', async (req, res) => {
  try {
    const { availability } = req.body;
    
    const professor = await Professor.findOneAndUpdate(
      { userId: req.user._id },
      { availability },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: professor.availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get professor dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const professor = await Professor.findOne({ userId: req.user._id });
    
    // Count courses teaching
    const coursesCount = professor.coursesTeaching.length;

    // Get total students across all courses (you'll need to implement this logic)
    const totalStudents = 0; // Placeholder

    // Get upcoming classes for today
    const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const timetable = await Timetable.findOne({
      'schedule.slots.professorId': professor._id,
      isActive: true
    });

    let todayClasses = 0;
    if (timetable) {
      const todaySchedule = timetable.schedule.find(day => day.day === today);
      todayClasses = todaySchedule ? todaySchedule.slots.length : 0;
    }

    res.status(200).json({
      success: true,
      data: {
        coursesCount,
        totalStudents,
        todayClasses,
        upcomingDeadlines: 0 // Placeholder for assignments/deadlines
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