const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required']
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  department: {
    type: String,
    required: true,
    enum: ['computer_science', 'electronics', 'mechanical', 'civil', 'management', 'law']
  },
  program: {
    type: String,
    required: true,
    enum: ['B.Tech', 'M.Tech', 'MBA', 'BBA', 'B.Com', 'LLB']
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  description: String,
  learningOutcomes: [String],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  maxStudents: {
    type: Number,
    default: 60
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor'
  },
  coProfessors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);