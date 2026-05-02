const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  action: String,
  entityType: String,
  entityName: String,
  details: String,
  user: { type: String, default: 'Procurement Officer (Admin)' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audit', auditSchema);
