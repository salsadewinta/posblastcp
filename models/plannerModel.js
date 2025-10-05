const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
  tgl_planner: {
    type: String
  },
  tema: {
    type: String
  }
});

const Planner = mongoose.model('Planner', plannerSchema);
module.exports = Planner;
