const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const { createServer } = require('http');
const { Server } = require('socket.io');
require("dotenv").config();
const passport = require('./services/passport')


const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 8000;
const io = new Server(server, {
    cors: {
        origin: `${process.env.CLIENT_URL}`,
    },
})


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        throw err;
    });

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use((req, res, next) => {
    req.io = io;
    next();
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api', require('./routes/api'))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})