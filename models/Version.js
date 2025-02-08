const mongoose = require('mongoose');

// Define the schema for the Version model
const versionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  androidVersion: {
    type: String,
    required: true
  },
  buildNumber: {
    type: String,
    required: true
  },
  releaseType: {
    type: String,
  },
  releaseDate: {
    type: String,
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create the model from the schema
const Version = mongoose.model('Version', versionSchema);

module.exports = Version;
