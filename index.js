require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authenticateJWT = require('./backend/middleware/authJWT');
const connectDB = require('./backend/config/dbConnection');

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB database
connectDB();

// Express JSON middleware
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// routes
app.use('/register', require('./backend/routes/register'));
app.use('/auth', require('./backend/routes/authenticate'));
app.use('/logout', require('./backend/routes/logout'));
app.use('/refresh', require('./backend/routes/refresh'));

app.use(authenticateJWT);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB database');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
