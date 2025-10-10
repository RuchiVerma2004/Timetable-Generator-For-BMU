const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Student, Professor, Admin } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, profile, additionalInfo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      profile
    });

    // Create role-specific profile
    if (role === 'student') {
      await Student.create({
        userId: user._id,
        studentId: additionalInfo.studentId,
        enrollmentNumber: additionalInfo.enrollmentNumber,
        department: additionalInfo.department,
        program: additionalInfo.program,
        semester: additionalInfo.semester,
        batch: additionalInfo.batch,
        section: additionalInfo.section
      });
    } else if (role === 'professor') {
      await Professor.create({
        userId: user._id,
        employeeId: additionalInfo.employeeId,
        department: additionalInfo.department,
        designation: additionalInfo.designation,
        qualifications: additionalInfo.qualifications,
        specialization: additionalInfo.specialization,
        office: additionalInfo.office
      });
    } else if (role === 'admin') {
      await Admin.create({
        userId: user._id,
        adminId: additionalInfo.adminId,
        department: additionalInfo.department
      });
    }

    // Update last login
    await user.updateLastLogin();

    createSendToken(user, 201, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Update last login
    await user.updateLastLogin();

    createSendToken(user, 200, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    let userData = {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profile
    };

    // Add role-specific data
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id })
        .populate('coursesEnrolled.courseId');
      userData.studentInfo = student;
    } else if (req.user.role === 'professor') {
      const professor = await Professor.findOne({ userId: req.user._id })
        .populate('coursesTeaching.courseId');
      userData.professorInfo = professor;
    } else if (req.user.role === 'admin') {
      const admin = await Admin.findOne({ userId: req.user._id });
      userData.adminInfo = admin;
    }

    res.status(200).json({
      success: true,
      user: userData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;