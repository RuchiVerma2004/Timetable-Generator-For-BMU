const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  semester: {
    type: String,
    required: true 
  },
  department: {
    type: String,
    required: true
  },
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      required: true
    },
    slots: [{
      timeSlot: {
        start: String, 
        end: String    
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      courseCode: String,
      courseName: String,
      professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor'
      },
      professorName: String,
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
      },
      roomCode: String,
      batch: String,
      section: String
    }]
  }],
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: Number,
    default: 1
  },
  conflicts: [{
    type: {
      type: String,
      enum: ['room_conflict', 'professor_conflict', 'student_conflict']
    },
    description: String,
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: Date
  }]
}, {
  timestamps: true
});

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;