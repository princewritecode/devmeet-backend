const express = require('express');
const authRouter = express.Router();
const userModel = require('../model/userModel');



authRouter.post('/signup', async (req, res) =>
{

    try
    {
        const { firstName, lastName, emailId, password, gender } = req.body;
        const user = new userModel({ firstName, lastName, emailId, password, gender });
        await user.save();
        res.send(user);
    }
    catch (err)
    {
        console.log(err);
    }
});


module.exports = authRouter;