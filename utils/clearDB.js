import mongoose from 'mongoose';
import Event from '../models/event.js';

async function clearDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/eventsDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await Event.deleteMany({});
        console.log("Events collection cleared.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        mongoose.connection.close();
    }
}

clearDB();