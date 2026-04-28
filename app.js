const express = require('express');
const app = express();
const connectDb = require('./database/config');
const authRouter = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoute');
const cookieParser = require('cookie-parser');
const requestRouter = require('./routes/request');
app.use(cookieParser());
app.use(express.json());
app.use(authRouter);
app.use(profileRoute);
app.use(requestRouter);

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

