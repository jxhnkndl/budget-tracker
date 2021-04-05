// Import Mongoose
const mongoose = require('mongoose');

// Instantiate Schema class
const Schema = mongoose.Schema;

// Define schema for new transactions
const transactionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Enter a name for transaction',
  },
  value: {
    type: Number,
    required: 'Enter an amount',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Compile Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
