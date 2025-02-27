import { Request, Response } from "express";
import Thought from "../models/Thought.js";
import User from "../models/User.js";

export default {
    // GET all thoughts
    async getThoughts(_req: Request, res: Response) {
        try {
            const thoughts = await Thought.find();
            return res.json(thoughts);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // GET a single thought by _id
    async getSingleThought(req: Request<{ thoughtId: string }>, res: Response) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            
            if (!thought) {
                return res.status(404).json({ message: "No thought found with this ID" });
            }

            return res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // POST a new thought (and add it to the user's thoughts array)
    async createThought(req: Request, res: Response) {
        try {
            const thought = await Thought.create(req.body);

            // Push the new thought's ID to the associated user's thoughts array
            await User.findByIdAndUpdate(
                req.body.userId, 
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            return res.json(thought);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    // PUT update a thought by _id
    async updateThought(req: Request<{ thoughtId: string }>, res: Response) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                req.body,
                { new: true, runValidators: true }
            );

            if (!thought) {
                return res.status(404).json({ message: "No thought found with this ID" });
            }

            return res.json(thought);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    // DELETE a thought by _id
    async deleteThought(req: Request<{ thoughtId: string }>, res: Response) {
        try {
            const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

            if (!thought) {
                return res.status(404).json({ message: "No thought found with this ID" });
            }

            // Remove thought reference from user's thoughts array
            await User.findByIdAndUpdate(
                thought.username,
                { $pull: { thoughts: thought._id } },
                { new: true }
            );

            return res.json({ message: "Thought deleted!" });
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // POST a reaction (add a reaction to a thought)
    async addReaction(req: Request<{ thoughtId: string }>, res: Response) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $push: { reactions: req.body } },
                { new: true, runValidators: true }
            );

            if (!thought) {
                return res.status(404).json({ message: "No thought found with this ID" });
            }

            return res.json(thought);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    // DELETE a reaction (remove a reaction from a thought)
    async removeReaction(req: Request<{ thoughtId: string; reactionId: string }>, res: Response) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: "No thought found with this ID" });
            }

            return res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
};
