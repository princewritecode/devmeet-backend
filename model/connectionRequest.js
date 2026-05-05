const mongoose = require('mongoose');

const connectionRequest = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status value`
        }
    }
}, { timestamps: true });


connectionRequest.index({ fromUserId: 1, toUserId: 1 });
connectionRequest.pre("save", function (next)
{
    const connectionRequestFrom = this;
    if (connectionRequestFrom.fromUserId.equals(connectionRequestFrom.toUserId))
    {
        throw new Error('Invalid....');
    }
});

const connectionModel = new mongoose.model('connections', connectionRequest);

module.exports = connectionModel;