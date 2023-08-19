import express from 'express';
import mongoose from 'mongoose';
import connectDB from './db.js';
import eventsRouter from './routes/events.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use('/api/events', eventsRouter);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
