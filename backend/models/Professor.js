const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    uppercase: true
  },
  department: {
    type: String,
    required: true,
    enum: ['computer_science', 'electronics', 'mechanical', 'civil', 'management', 'law']
  },
  designation: {
    type: String,
    required: true,
    enum: ['Assistant Professor', 'Associate Professor', 'Professor', 'Visiting Faculty']
  },
  qualifications: [{
    degree: String,
    specialization: String,
    university: String,
    year: Number
  }],
  specialization: [String],
  coursesTeaching: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    courseCode: String,
    courseName: String,
    teachingSince: {
      type: Date,
      default: Date.now
    }
  }],
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    timeSlots: [{
      start: String,
      end: String
    }]
  }],
  office: String,
  officeHours: String
}, {
  timestamps: true
});

const Professor = mongoose.model('Professor', professorSchema);
module.exports = Professor;