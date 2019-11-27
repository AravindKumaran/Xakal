const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
var loginController = require('./controllers/loginController.js');
var classNotesController = require('./controllers/classNotesController.js');
var assessmentController = require('./controllers/assessmentController.js');
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/xakal', { useNewUrlParser: true })
const connection = mongoose.connection;
connection.once('open', function () {
    console.log('MongoDB database connection established successfully')
})

app.use('/xakal', loginController);
app.use('/xakal/class-notes', classNotesController);
app.use('/xakal/assessment', assessmentController);

app.listen(PORT, function () {
    console.log('Server is running on Port: ' + PORT)
})