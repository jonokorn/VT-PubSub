const express = require('express');
const EventEmitter = require('events');

const app = express();
const PORT = 3000;

// Create a new EventEmitter instance
const eventEmitter = new EventEmitter();

// Middleware to parse JSON bodies
app.use(express.json());

// Publisher endpoint
app.post('/publish', (req, res) => {
    const { topic, message } = req.body;
    if (!topic || !message) {
        return res.status(400).send('Topic and message are required');
    }

    // Emit an event with the topic as the event name
    eventEmitter.emit(topic, message);
    res.send('Message published');
});

// Subscriber endpoint
app.get('/subscribe/:topic', (req, res) => {
    const { topic } = req.params;

    // Define an event listener for the given topic
    const messageHandler = (message) => {
        res.json({ topic, message });
    };

    // Subscribe to the topic
    eventEmitter.once(topic, messageHandler);

    // Set a timeout to ensure the request does not hang indefinitely
    setTimeout(() => {
        eventEmitter.removeListener(topic, messageHandler);
        res.status(204).send();  // No content if no message is received
    }, 300000); // 30 seconds timeout
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
