const mongoose = require('mongoose');

const clientRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      validate: {
        validator: function(v) {
          if (!v) return true;
          const wordCount = v.trim().split(/\s+/).filter(word => word.length > 0).length;
          return wordCount <= 300;
        },
        message: 'Description cannot exceed 300 words'
      }
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Done'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ClientRequest', clientRequestSchema);
