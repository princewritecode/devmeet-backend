const express = require('express');
const authRouter = express.Router();
const userModel = require('../model/userModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
authRouter.post('/signup', async (req, res) =>
{
    try
    {
        const { firstName, lastName, emailId, password, gender } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new userModel({ firstName, lastName, emailId, password: passwordHash, gender });
        await user.save();
        res.send(user);
    }
    catch (err)
    {
        console.log(err);
    }
});

authRouter.post('/login', async (req, res) =>
{
    try
    {
        const { emailId, password } = req.body;

        const user = await userModel.findOne({ emailId });
        if (!user)
        {
            // Use return to stop execution and send a 401
            return res.status(401).send('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid)
        {
            // Use environment variables for secrets!
            const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: '1h' });

            // Set security flags on the cookie
            res.cookie('token', token, {
                httpOnly: true, // Prevents XSS
                expires: new Date(Date.now() + 3600000), // 1 hour
                // secure: true, // Only use this if you are on HTTPS
            });

            return res.send('Login successful');
        } else
        {
            return res.status(401).send('Invalid credentials');
        }
    } catch (err)
    {
        // Log the actual error for you, but send a generic message to user
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

authRouter.delete('/userdelete', async (req, res) =>
{
    const userIdRecieved = req.body.userId;
    const user = await userModel.findByIdAndDelete({ _id: userIdRecieved });
    res.send('user deleted successfullyu....');
});
authRouter.patch('/update', async (req, res) =>
{
    const userId = req.body.userIds;
    const userData = req.body;
    const user = await userModel.findByIdAndUpdate(userId, userData, { runValidators: true });
    await user.save();
    res.send('updated');
});

module.exports = authRouter;