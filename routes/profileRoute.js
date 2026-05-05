const express = require('express');
const profileRoute = express.Router();
const JWT = require('jsonwebtoken');
const userModel = require('../model/userModel');
const userAuth = require('../middleware/userAuth');
const validateEditProfileData = require('../utils/validations');

profileRoute.get('/profile/view', userAuth, async (req, res) =>
{
    try
    {
        const loggedInUser = req.user;
        res.send(loggedInUser);
    }
    catch (err) { console.log(err.message); }
});
profileRoute.patch('/profile/edit', userAuth, async (req, res) =>
{
    try
    {
        validateEditProfileData(req);
        const loggedInUser = req.user;
        console.log(loggedInUser);
        Object.keys(req.body).forEach((key) =>
        {
            return loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        console.log(loggedInUser);
        res.json({ message: 'updated user', data: loggedInUser });
    }
    catch (err)
    {
        res.status(400).send(err.message);
    }
});


module.exports = profileRoute;