const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  criterionId: String,
  status: String, 
  extractedValue: String,
  explanation: String,
  sourceReference: String
});

const bidderSchema = new mongoose.Schema({
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender' },
  name: String,
  documents: [String],
  evaluations: [evaluationSchema],
  overallStatus: String, 
  submissionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bidder', bidderSchema);
