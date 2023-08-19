import mongoose from 'mongoose';

const EventSchema = mongoose.Schema({
    eventId: Number,
    title: String,
    startDatetime: String,
    endDatetime: String,
    address: String,
    locationName: String,
    totalTicketsCount: Number,
    assetUrl: String,
    lineUp: [String],
    ticketCollections: [{
        collectionName: String,
        scAddress: String,
        collectionAddress: String,
        pricePerToken: Number,
        maxMintPerUser: Number,
        saleSize: Number
    }]
});

export default mongoose.model('event', EventSchema);
