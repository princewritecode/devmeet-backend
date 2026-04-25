const mongoose = require('mongoose');
const connectDb = async () =>
{
    await mongoose.connect('mongodb+srv://princedevs:7747871218@learnnode.vs3dvny.mongodb.net/devmeet');
};

module.exports = connectDb;