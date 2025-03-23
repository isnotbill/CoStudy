require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authenticateJWT = require('./backend/middleware/authJWT');
const connectDB = require('./backend/config/dbConnection');
const uploadImageRoutes = require('./backend/routes/image-routes');

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB database
connectDB();

// Express JSON middleware
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// routes
app.use('/register', require('./backend/routes/register-route'));
app.use('/auth', require('./backend/routes/auth-route'));
app.use('/refresh', require('./backend/routes/refresh-route'));
app.use('/logout', require('./backend/routes/logout-route'));
app.use('/test', authenticateJWT, require('./backend/routes/api/test'));
app.use('/image', uploadImageRoutes);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB database');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
