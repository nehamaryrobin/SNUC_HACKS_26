const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    groupStreak: {
      type: Number,
      default: 0,
    },
    groupXp: {
      type: Number,
      default: 0,
    },
    potAmount: {
      type: Number,
      default: 0,
    },
    // Allows us to track if the group resets or what happens on miss
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Group', groupSchema);
