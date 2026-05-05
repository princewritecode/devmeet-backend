const express = require('express');
const JWT = require('jsonwebtoken');
const userModel = require('../model/userModel');

const userAuth = async (req, res, next) =>
{
    try
    {
        // 1. Safely extract token
        const { token } = req.cookies;

        // 2. Check if token exists BEFORE trying to verify it
        if (!token)
        {
            // Send a 401 Unauthorized so the frontend knows to redirect to login
            return res.status(401).send("Please login!");
        }

        // 3. Verify the token
        const decodeValue = await JWT.verify(token, 'devmeet@123');
        const { _id } = decodeValue;

        // 4. Find the user
        const userGot = await userModel.findById(_id); // .findById is cleaner than .findOne({_id})

        if (!userGot)
        {
            return res.status(404).send("User not found");
        }

        // 5. Attach user to request object
        req.user = userGot;
        next();

    } catch (err)
    {
        // Handle specific JWT errors (like expired or tampered tokens)
        res.status(401).send("Invalid Token: " + err.message);
    }
};

module.exports = userAuth;