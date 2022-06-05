const { Schema, model } = require('mongoose');

const ReactionSchema = require('./Reactions');
const moment = require('moment');

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [ReactionSchema]
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
)

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length
})

const Thoughts = model('Thoughts', ThoughtSchema);

module.exports = Thoughts;