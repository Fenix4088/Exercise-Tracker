const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express()
const cors = require('cors')
const {userController} = require('./user.controller.js');
require('dotenv').config()

const { connect } = mongoose;
mongoose.set("strictQuery", false);

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

const ENDPOINTS = {
  USERS: "/api/users",
  CREATE_EXCERCISE: "/api/users/:userId/exercises",
  EXCERCISES_LOG: "/api/users/:userId/logs"
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post(ENDPOINTS.USERS, (req, res) => userController.createUser(req, res));

app.get(ENDPOINTS.USERS, (req, res) => userController.getUsersList(req, res));

app.post(ENDPOINTS.CREATE_EXCERCISE, (req, res) => userController.createExcercise(req, res))

app.get(ENDPOINTS.EXCERCISES_LOG, (req, res) => userController.getUserLogs(req, res))

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const connectDB = async () => {
  connect(process.env.DB_URL)
    .then(() => console.log('Connected Successfully'))
    .catch((err) => console.error('Not Connected'));
}

connectDB();
