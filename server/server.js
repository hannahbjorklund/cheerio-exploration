const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// Route Includes
const ao3Router = require('./routes/ao3.router');
const ffRouter = require('./routes/ffdotnet.router');

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

// Routes
app.use('/api/ao3', ao3Router);
app.use('/api/ffdotnet', ffRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
