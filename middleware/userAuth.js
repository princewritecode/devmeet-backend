const express = require('express');
const JWT = require('jsonwebtoken');
const userModel = require('../model/userModel');
const userAuth = async (req, res, next) =>
{
    try
    {
        const { token } = req.cookies;
        console.log(token);
        const decodeValue = await JWT.verify(token, 'devmeet@123');
        const { _id } = decodeValue;
        const userGot = await userModel.findOne({ _id });
        if (!userGot)
        {
            throw new Error('user not logged in cant access');
        }
        req.user = userGot;
        next();
    }
    catch (err)
    {
        console.log(err);
    }
};


module.exports = userAuth;


