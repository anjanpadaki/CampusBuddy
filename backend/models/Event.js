const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop'],
    required: true
  },
  date: { type: Date, required: true },
  location: { type: String, required: true, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
