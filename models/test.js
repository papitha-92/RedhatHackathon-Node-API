const mongoose = require('mongoose');
const testSchema = mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
name : String,
company : String
});

module.exports = mongoose.model('Test', testSchema);