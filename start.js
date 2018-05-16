const mongoose = require('mongoose');

// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to the database and handle any bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err => {
  console.log(`Error → ${err.message}`);
});

// Start out app!
const app = require('./app');

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
