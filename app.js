const express = require('express');
const app = express();
const connectDb = require('./database/config');
const authRouter = require('./routes/authRoute');

app.use(express.json());
app.use(authRouter);

app.listen(3000, () =>
{
    connectDb().then(() =>
    {
        console.log('connected to database...');
    }).catch((err) =>
    {
        console.log(err);
    });

    console.log('started the server on 3000');
});