const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  gravity: { type: Number, required: true },
  objectType: { type: String, required: true },
  duration: { type: Number, required: true },
  result: { type: Object, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Simulation', simulationSchema);
