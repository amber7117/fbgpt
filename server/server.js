const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const { createServer } = require('http');
const { Server } = require('socket.io');
require("dotenv").config();
const passport = require('./services/passport')

const bodyParser = require('body-parser');
const axios = require('axios');


const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample items to purchase
const items = [
  { id: 'item1', name: 'Item 1', price: 10 },
  { id: 'item2', name: 'Item 2', price: 20 }
];

// Endpoint to handle Facebook's webhook
app.post('/webhook', (req, res) => {
  console.log('Webhook event received:', req.body);
  res.sendStatus(200);
});

// Endpoint to handle Facebook payment callback
app.get('/callback', (req, res) => {
  const { payment_id, status } = req.query;
  console.log('Payment callback received:', { payment_id, status });
  res.send('Payment received');
});

// Endpoint to initiate a payment
app.post('/create-payment', (req, res) => {
  const { item_id } = req.body;
  const item = items.find(i => i.id === item_id);

  if (!item) {
    return res.status(400).send('Item not found');
  }

  // Here you would integrate with Facebook's payment API to initiate the payment.
  // For demonstration purposes, we'll just return a dummy URL.

  const paymentUrl = `https://example.com/checkout?item_id=${item_id}`;

  res.json({ url: paymentUrl });
});



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