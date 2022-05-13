const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  Name: { type: String, required: true },
  Sickness: { type: String, required: true },
  Doctor: { type: String, required: true },
  date: { type: Number, required: false },
}, {
  timestamps: true,
});

const Patients_info = mongoose.model('Patients', patientSchema);

module.exports = Patients_info;