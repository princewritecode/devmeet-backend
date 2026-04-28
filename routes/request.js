const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middleware/userAuth');
const userModel = require('../model/userModel');
const connectionModel = require('../model/connectionRequest');
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) =>
{
    try
    {
        const loggedInUser = req.user;
        console.log('sending connection request');
        const { status, toUserId } = req.params;
        console.log(status, toUserId);
        const allowedStatus = ["interested", "ignore"];
        const fromUserId = loggedInUser._id; // Define this variable clearly

        const toUserExist = await userModel.findById({ toUserId });
        if (!toUserExist)
        {
            return res.status(400).json({ message: 'No users found' });
        }

        if (!allowedStatus.includes(status))
        {
            return res.status(400).json({ message: "invalid status type" });
        }
        //check if connection already exist or not
        const checkExistingConnection = await connectionModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (checkExistingConnection)
        {
            return res.status(400).json({ message: 'connection request already exist' });
        }
        const connection = new connectionModel({ toUserId, fromUserId: loggedInUser._id, status });
        const data = await connection.save();
        res.json({
            message: "connection request sent successfully",
            data
        });
    }
    catch (err)
    {
        res.status(400).send('not valid status');
    }

});

module.exports = requestRouter;