const express = require('express');
const app = express();
const prisma = require('./configs/database');
const poinRoutes = require('./routes/PoinRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/poin', poinRoutes);

//  if database is connected, then start the server
prisma.$connect().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
        console.log('Database is connected');
    });
}).catch((err) => {
    console.log(err);
});