import { Request, Response } from "express";
import User from "../models/User.js";
import Thought from "../models/Thought.js";



export default {
    // GET all users
    async getUsers(_req: Request, res: Response) {
        try {
            const users = await User.find().populate('thoughts').populate('friends');
            return res.json(users);
        } catch (err) {
           return res.status(500).json(err);
        }
    },

    // GET single user by _id
    async getSingleUser(req: Request<{ userId: string}>, res: Response) {
        try {
            const user = await User.findById(req.params.userId)
                .populate('thoughts')
                .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'No user found with this ID' });
            }

            return res.json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // POST new user
    async createUser(req: Request, res: Response) {
        try {
            const user = await User.create(req.body);
            return res.json(user);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    // PUT update user by _id
    async updateUser(req: Request<{ userId: string}>, res: Response) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true });

            if (!user) {
                return res.status(404).json({ message: 'No user found with this ID' });
            }

            return res.json(user);
        } catch (err) {
           return res.status(400).json(err);
        }
    },

    // DELETE user by _id (BONUS: Remove user's thoughts)
    async deleteUser(req: Request<{ userId: string}>, res: Response) {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);

            if (!user) {
                return res.status(404).json({ message: 'No user found with this ID' });
            }

            // Remove thoughts associated with user
            await Thought.deleteMany({ _id: { $in: user.thoughts } });

            return res.json({ message: 'User and associated thoughts deleted!' });
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Add a friend to user's friend list
async addFriend(req: Request<{ userId: string; friendId: string }>, res: Response) {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId } }, // Ensures no duplicates
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "No user found with this ID" });
        }

        return res.json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
},

// Remove a friend from user's friend list
async removeFriend(req: Request<{ userId: string; friendId: string }>, res: Response) {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "No user found with this ID" });
        }

        return res.json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}

};
