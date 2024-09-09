const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const passport = require('./services/passport');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server and Socket.io server
const server = createServer(app);
const io = new Server(server);

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Use routes
app.use('/api', require('./routes/api'));

// Middleware to attach Socket.io instance
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Start server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
