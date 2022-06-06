const { connect } = require('http2');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

module.exports = mongoose.connection;