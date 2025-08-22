const express = require('express');
const cors = require('cors');
const { route } = require('./routes/api/base');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use('/api', route)

app.listen(process.env.PORT, () => {

    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('MongoDB connection error:', err);
    });

    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

