const express = require('express');
const userAuth = require('../middleware/userAuth');
const connectionModel = require('../model/connectionRequest');
const userModel = require('../model/userModel');
const userRouter = express.Router();
userRouter.get('/user/request/recieved', userAuth, async (req, res) =>
{
    try
    {
        const loggedInUser = req.user;
        console.log(loggedInUser);
        const connection = await connectionModel.find({ toUserId: loggedInUser._id, status: 'interested' }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);
        res.json({ message: 'data fetched successfully', data: connection });
    }
    catch (err)
    {
        res.status(400).send(err.message);
    }
});


userRouter.get('/user/connections', userAuth, async (req, res) =>
{
    try
    {
        const loggedInUser = req.user;

        // Find connections where user is either sender or receiver
        const connections = await connectionModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", ["firstName", "lastName", "photoUrl", "about"])
            .populate("toUserId", ["firstName", "lastName", "photoUrl", "about"]);

        // Clean Data: You can either filter it here or on the frontend.
        // On the backend, we can map it so the frontend only gets the "Other Person"
        const data = connections.map((row) =>
        {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString())
            {
                return { ...row.toObject(), displayUser: row.toUserId };
            }
            return { ...row.toObject(), displayUser: row.fromUserId };
        });

        res.json({ message: "Connections fetched", data: data });
    } catch (err)
    {
        res.status(400).send(err.message);
    }
});


userRouter.get('/user/feed', userAuth, async (req, res) =>
{
    try
    {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find all connections involving the user
        const connections = await connectionModel.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        // Collect all IDs to hide (people I've interacted with + myself)
        const hideUsers = new Set();
        hideUsers.add(loggedInUser._id.toString());

        connections.forEach((conn) =>
        {
            hideUsers.add(conn.fromUserId.toString());
            hideUsers.add(conn.toUserId.toString());
        });

        // Find users NOT in that set
        const users = await userModel.find({
            _id: { $nin: Array.from(hideUsers) }
        })
            .select("firstName lastName about skills photoUrl age gender")
            .skip(skip)
            .limit(limit);

        res.json({ message: 'Feed fetched', data: users });
    } catch (err)
    {
        res.status(400).send(err.message);
    }
});

module.exports = userRouter;