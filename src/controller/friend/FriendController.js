const User = require("../../model/userModel");

const getUsers = async (req, res) => {
    try {
        const uid = req.headers["uid"];
        console.log(uid);
        const users = await User.find({ _id: { $ne: uid } });
        if (!users) {
            return res.send("No User Found Instead of You");
        }
        console.log(users);
        res.send(users);
    } catch (error) { }
};


const addFriends = async (req, res) => {
    try {
        const { id } = req.body;
        const uid = req.headers["uid"];

        if (!uid || !id) {
            return res.send({ message: "UID and Friend ID are required" });
        }

        const Me = await User.findOne({ _id: uid });
        const Friend = await User.findOne({ _id: id });

        if (!Me || !Friend) {
            res.send({ message: "User not found" });
        }

        if (!Me.sentFR.includes(id)) {
            Friend.pendingFR.push(uid);
            Me.sentFR.push(id);
        } else {
            return res.send({ message: "Already Sent Request" })
        }
        if (Me.friends.includes(Friend._id)) {
            return res.send({ message: "Already friends" });
        }

        await Me.save();
        await Friend.save();

    await res.status(201).send({ message: "Request Sent" });
    } catch (error) {
        console.log(error);
    }
};
const acceptReq = async (req, res) => {
    try {
        const { id } = req.body;
        const uid = req.headers["uid"];

        if (!uid || !id) {
            return res.send({ message: "UID and Friend ID are required" });
        }

        const Me = await User.findOne({ _id: uid });
        const Friend = await User.findOne({ _id: id });

        if (!Me || !Friend) {
            res.send("User not found");
        }

        if (Me.friends.includes(Friend._id)) {
            return res.send({ message: "Already friends" });
        }

        Me.friends.push(Friend._id);
        Friend.friends.push(Me._id);

        Me.pendingFR = Me.pendingFR.filter((fr) => fr.toString() !== id);
        Friend.sentFR = Friend.sentFR.filter(
            (fr) => fr.toString() !== Me._id.toString()
        );

        await Me.save();
        await Friend.save();

        await res.status(200).send('Friend Request Accepted');
    } catch (error) {
        console.log(error);
    }
};
const cancelReq = async (req, res) => {
    try {
        const { id } = req.body;
        const uid = req.headers["uid"];

        if (!uid || !id) {
            return res.send({ message: "UID and Friend ID are required" });
        }

        const Me = await User.findOne({ _id: uid });
        const Friend = await User.findOne({ _id: id });

        if (!Me || !Friend) {
            res.send("User not found");
        }

        Friend.pendingFR = Friend.pendingFR.filter((fr) => fr.toString() !== uid);
        Me.sentFR = Me.sentFR.filter(
            (fr) => fr.toString() !== Friend._id.toString()
        );

        await Me.save();
        await Friend.save();
        await res.send({ message: "Request Cancelled" });
    } catch (error) {
        console.log(error);
    }
};

const deleteFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const uid = req.headers["uid"];

        if (!uid || !id) {
            return res.send({ message: "UID and Friend ID are required" });
        }

        const Me = await User.deleteOne({ _id: uid });
        const Friend = await User.findOne({ _id: id });

        if (!Me || !Friend) {
            res.send("User not found");
        }
        Me.friends = Me.friends.filter((fr) => fr.toString() !== id);
        Friend.friends = Me.friends.filter(
            (fr) => fr.toString() !== Me._id.toString()
        );

        await Me.save();
        await Friend.save();
        await res.send(Me, { FrStatus: "add friend" });
    } catch (error) {
        console.log(error);
    }
};


const getFriends = async (req, res) => {
    try {
        const uid = req.headers["uid"];
        const user = await User.findOne({ _id: uid }).populate("friends");
        if (!user) {
            return res.send("User not found");
        }
        res.send(user.friends);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {getFriends, getUsers, addFriends, deleteFriend, acceptReq, cancelReq };
