const express = require('express');
const prisma = require('./configs/database');
import createServer from './utils/server';

//  create server
const app = createServer();

//  if database is connected, then start the server
prisma.$connect().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
        console.log('Database is connected');
    });
}).catch((err) => {
    console.log(err);
});