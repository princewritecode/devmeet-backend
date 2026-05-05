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

        const toUserExist = await userModel.findById(toUserId);
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


requestRouter.post(
    '/request/review/:status/:requestId',
    userAuth,
    async (req, res, next) =>
    {
        try
        {
            const loggedInUser = req.user;
            const { status, requestId } = req.params;

            // 1. Validate Status
            const allowedStatus = ['accepted', 'rejected'];
            if (!allowedStatus.includes(status))
            {
                return res.status(400).json({
                    message: `Invalid status. Allowed: ${allowedStatus.join(', ')}`
                });
            }

            // 2. Find the Connection Request
            // We search for the specific request ID AND ensure the toUserId is the loggedInUser
            const connectionRequest = await connectionModel.findOne({
                // Use the ID from the URL
                toUserId: loggedInUser._id, // Ensure ONLY the recipient can accept/reject
                status: 'interested',       // Ensure the request is still pending
            });

            // 3. Check if it exists
            if (!connectionRequest)
            {
                return res.status(404).json({
                    message: 'Connection request not found or unauthorized'
                });
            }

            // 4. Update and Save
            connectionRequest.status = status;
            const data = await connectionRequest.save();

            res.json({
                message: `Connection request ${status} successfully`,
                data
            });

        } catch (err)
        {
            // This catches database errors (like invalid ObjectId format)
            res.status(400).json({ message: "Transaction failed: " + err.message });
        }
    }
);
module.exports = requestRouter;


