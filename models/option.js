const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  is_correct: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Option', optionSchema);