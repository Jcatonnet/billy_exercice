import express from 'express';
import Event from '../models/event.js';
import moment from 'moment';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const { saleStartDate } = req.query;
        let events;

        if (saleStartDate) {
            const parsedDate = moment(saleStartDate, 'DD/MM/YYYY').toISOString();
            events = await Event.find({ saleStartDate: parsedDate });
        } else {
            events = await Event.find();
        }

        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({ eventId: req.params.id });

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    const { title, lineUp, assetUrl, collectionName } = req.body;

    const eventFields = {};
    if (title) eventFields.title = title;
    if (lineUp) eventFields.lineUp = lineUp.split('-');
    if (assetUrl) eventFields.assetUrl = assetUrl;
    if (collectionName) eventFields.ticketCollections = [{ collectionName: collectionName }];
    
    try {
        let event = await Event.findOne({ eventId: req.params.id });

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        event = await Event.findOneAndUpdate(
            { eventId: req.params.id },
            { $set: eventFields },
            { new: true }
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
