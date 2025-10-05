const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wablastSchema = new mongoose.Schema({
  message: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  foto: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  customers: [{
    type: Schema.Types.ObjectId,
    ref: 'Pelanggan',
    required: true
  }]
});

const Wablast = mongoose.model('Wablast', wablastSchema);
module.exports = Wablast;
