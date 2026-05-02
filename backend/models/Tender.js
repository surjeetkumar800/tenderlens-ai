const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
  id: String,
  category: String,
  description: String,
  type: String,
  targetValue: String,
  requiredEvidence: String
});

const tenderSchema = new mongoose.Schema({
  title: String,
  department: String,
  criteria: [criteriaSchema],
  documentPath: String,
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tender', tenderSchema);
