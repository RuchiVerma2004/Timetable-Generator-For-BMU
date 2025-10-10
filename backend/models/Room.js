const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: [true, 'Room code is required'],
    unique: true,
    uppercase: true
  },
  roomName: {
    type: String,
    required: [true, 'Room name is required']
  },
  building: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['lecture', 'lab', 'seminar', 'conference', 'office'],
    required: true
  },
  facilities: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;