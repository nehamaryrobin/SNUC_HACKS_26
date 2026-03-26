const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'kicked'],
    default: 'active',
  },
  lastCompletedDay: {
    type: Number,
    default: null,
  }
}, { _id: false });

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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    payment_type: {
      type: String,
      enum: ['free', 'paid'],
      required: true,
    },
    verification_type: {
      type: String,
      enum: ['api', 'manual'],
      required: true,
    },
    deposit_amount: {
      type: Number,
      default: 0,
    },
    members: [memberSchema],
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
