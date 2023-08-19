Event Management API

This repository contains the backend code for an Event Management API. It allows users to fetch event details, filter events based on sale start dates, and update event details.

Features

- Data parsing from CSV and JSON files to populate the database.
- Fetch all events or filter by sale start date.
- Fetch event by ID
- Update event details using event ID.


Getting Started

Prerequisites
Node.js and npm installed.
MongoDB instance running locally or remotely.
Follow steps here for MongoDB https://www.mongodb.com/docs/manual/administration/install-community/


How to start the server:

- Install dependencies with npm install

- Populate the database using node parser.js (it will run the utils/parser.js file)
- utils/clearDB.js file is just here for the purpose of this exercie. In case we need to clean the DB.

- Start the server with node app.js

Then we can access API endpoints that are listed in routes/events.js
e.g: http://localhost:3000/api/events

API Endpoints
GET /api/events: Fetch all events. Add a query parameter saleStartDate in the format DD/MM/YYYY to filter events by sale start date.

Example: /api/events?saleStartDate=01/01/2023

PUT /api/events/:id: Update an event's details. Replace :id with the event's ID.
You can use tools such as Postman to play with the API