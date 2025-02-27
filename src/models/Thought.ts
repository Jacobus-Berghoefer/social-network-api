import { Schema, model, Types } from 'mongoose';

// Reaction Schema (Subdocument)
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            //get: (timestamp) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a'),
            get: (timestamp: Date) => new Date(timestamp).toLocaleString(),
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

// Thought Schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            //get: (timestamp) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a'),
            get: (timestamp: Date) => new Date(timestamp).toLocaleString(),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// Virtual for reaction count
thoughtSchema.virtual('reactionCount').get(function (this: any) {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

export default Thought;
