const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  adminId: {
    type: String,
    required: [true, 'Admin ID is required'],
    unique: true,
    uppercase: true
  },
  department: String,
  permissions: {
    canManageUsers: { type: Boolean, default: true },
    canGenerateTimetable: { type: Boolean, default: true },
    canManageCourses: { type: Boolean, default: true },
    canManageRooms: { type: Boolean, default: true },
    canViewAnalytics: { type: Boolean, default: true },
    canManageSystem: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);