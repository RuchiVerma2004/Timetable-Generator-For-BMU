const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

const router = express.Router();

// All routes protected
router.use(protect);
router.use(authorize('student'));

// Get student profile
router.get('/profile', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('coursesEnrolled.courseId')
      .populate('coursesEnrolled.courseId.professorId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

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
router.get('/timetable', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get timetable for student's department, batch, and section
    const timetable = await Timetable.findOne({
      department: student.department,
      'schedule.slots.batch': student.batch,
      'schedule.slots.section': student.section,
      isActive: true
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'No active timetable found for your batch and section'
      });
    }

    // Filter timetable to show only student's classes
    const studentTimetable = timetable.schedule.map(daySchedule => ({
      day: daySchedule.day,
      slots: daySchedule.slots.filter(slot => 
        slot.batch === student.batch && slot.section === student.section
      )
    }));

    res.status(200).json({
      success: true,
      data: studentTimetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get student attendance
router.get('/attendance', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    
    const attendance = await Attendance.find({ studentId: student._id })
      .populate('courseId', 'courseCode courseName')
      .populate('markedBy', 'profile.firstName profile.lastName')
      .sort({ date: -1 });

    // Calculate attendance summary by course
    const courseSummary = {};
    attendance.forEach(record => {
      const courseCode = record.courseId.courseCode;
      if (!courseSummary[courseCode]) {
        courseSummary[courseCode] = {
          courseName: record.courseId.courseName,
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        };
      }
      
      courseSummary[courseCode].total++;
      if (record.status === 'present') courseSummary[courseCode].present++;
      if (record.status === 'absent') courseSummary[courseCode].absent++;
      if (record.status === 'late') courseSummary[courseCode].late++;
    });

    // Calculate percentages
    Object.keys(courseSummary).forEach(courseCode => {
      const summary = courseSummary[courseCode];
      summary.percentage = summary.total > 0 ? 
        ((summary.present + summary.late * 0.5) / summary.total * 100).toFixed(1) : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        records: attendance,
        summary: courseSummary
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get enrolled courses
router.get('/courses', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('coursesEnrolled.courseId')
      .populate('coursesEnrolled.courseId.professorId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student.coursesEnrolled
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get today's classes
router.get('/today-classes', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();

    const timetable = await Timetable.findOne({
      department: student.department,
      'schedule.slots.batch': student.batch,
      'schedule.slots.section': student.section,
      isActive: true
    });

    let todayClasses = [];
    if (timetable) {
      const todaySchedule = timetable.schedule.find(day => day.day === today);
      if (todaySchedule) {
        todayClasses = todaySchedule.slots.filter(slot => 
          slot.batch === student.batch && slot.section === student.section
        );
      }
    }

    res.status(200).json({
      success: true,
      data: todayClasses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get student dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    
    // Count enrolled courses
    const coursesCount = student.coursesEnrolled.length;

    // Get today's classes count
    const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const timetable = await Timetable.findOne({
      department: student.department,
      'schedule.slots.batch': student.batch,
      'schedule.slots.section': student.section,
      isActive: true
    });

    let todayClasses = 0;
    if (timetable) {
      const todaySchedule = timetable.schedule.find(day => day.day === today);
      todayClasses = todaySchedule ? todaySchedule.slots.length : 0;
    }

    // Get attendance percentage
    const attendance = await Attendance.find({ studentId: student._id });
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === 'present').length;
    const lateClasses = attendance.filter(a => a.status === 'late').length;
    const attendancePercentage = totalClasses > 0 ? 
      ((presentClasses + lateClasses * 0.5) / totalClasses * 100).toFixed(1) : 0;

    // Get upcoming assignments (placeholder)
    const upcomingAssignments = 0;

    res.status(200).json({
      success: true,
      data: {
        coursesCount,
        todayClasses,
        attendancePercentage,
        upcomingAssignments,
        totalClasses,
        presentClasses,
        absentClasses: attendance.filter(a => a.status === 'absent').length,
        lateClasses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update student profile
router.put('/profile', async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Update user profile
    const User = require('../models/User');
    await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.phone': phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;