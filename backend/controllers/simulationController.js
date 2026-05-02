const Simulation = require('../models/Simulation');

// @route POST /api/simulate
// @desc  Save simulation results
const saveSimulation = async (req, res) => {
  try {
    const { gravity, objectType, duration, result } = req.body;
    
    const newSimulation = new Simulation({
      gravity,
      objectType,
      duration,
      result
    });

    const savedSimulation = await newSimulation.save();
    res.status(201).json(savedSimulation);
  } catch (error) {
    console.error('Error saving simulation:', error);
    res.status(500).json({ message: 'Failed to save simulation' });
  }
};

// @route GET /api/history
// @desc  Get recent simulations history
const getHistory = async (req, res) => {
  try {
    const simulations = await Simulation.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(simulations);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

module.exports = {
  saveSimulation,
  getHistory
};
