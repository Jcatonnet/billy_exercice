import fs from 'fs';
import mongoose from 'mongoose';
import Event from '../models/event.js';
import moment from 'moment';
import connectDB from '../db.js';

connectDB();

const parseAndInsertData = async () => {

    const csvData = fs.readFileSync('data/organizers-data.csv', 'utf8');
    const eventsLines = csvData.split('\n');
    eventsLines.shift();

    const events = eventsLines.map(line => {
        const columns = line.split(',');
        if (columns.length < 11) {
            console.error(`Skipping line due to missing columns: ${line}`);
            return null;
        }
        const eventId = parseInt(columns[0]);
        const totalTicketsCount = parseInt(columns[6]);

        if (isNaN(eventId) || isNaN(totalTicketsCount)) {
            console.error(`Skipping line due to invalid number values: ${line}`);
            return null;
        }

        return {
            eventId: eventId,
            title: columns[1],
            startDatetime: moment(columns[2], 'DD/MM/YYYY HH:mm').toISOString(),
            endDatetime: moment(columns[3], 'DD/MM/YYYY HH:mm').toISOString(),
            address: columns[5],
            locationName: columns[4] || null,
            totalTicketsCount: totalTicketsCount,
            saleStartDate: moment(columns[8], 'DD/MM/YYYY').toISOString(),
            assetUrl: (['.mp4', '.png', '.jpeg'].some(ext => columns[10].endsWith(ext))) ? columns[10] : null,
            lineUp: columns[9] ? columns[9].split('-') : null
        };
    }).filter(event => event !== null);

    let contracts;
    try {
        const jsonData = fs.readFileSync('data/smart-contracts-data.json', 'utf8');
        contracts = JSON.parse(jsonData);
    } catch (err) {
        console.error("Error parsing JSON:", err.message);
        return;
    }

    for (const event of events) {
        const eventContracts = contracts.filter(contract => contract.event_id === event.eventId);
        const ticketCollections = eventContracts.map(contract => ({
            collectionName: contract.collection_name,
            scAddress: contract.smart_contract.crowdsale,
            collectionAddress: contract.smart_contract.collection,
            pricePerToken: contract.smart_contract.sale_params.price_per_token,
            maxMintPerUser: contract.smart_contract.sale_params.max_mint_per_user,
            saleSize: contract.smart_contract.sale_params.sale_size
        }));

        const newEvent = new Event({
            ...event,
            ticketCollections: ticketCollections
        });
        await newEvent.save();
        console.log(`Saved event with ID: ${newEvent.eventId}`);
    }

    mongoose.connection.close();
}

parseAndInsertData();
