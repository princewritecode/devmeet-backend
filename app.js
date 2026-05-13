const express = require('express');
const app = express();
const connectDb = require('./database/config');
const authRouter = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoute');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');
const requestRouter = require('./routes/request');
const cors = require('cors');

app.use(cors({
    // Add your production domain and your local development URL
    origin: ["https://devmeet.site", "http://localhost:5174"],
    credentials: true, // Required for cookies/sessions
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser());
app.use(express.json());
app.use(authRouter);
app.use(profileRoute);
app.use(requestRouter);
app.use(userRouter);

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

