const { Thoughts, Users } = require('../models');

const thoughtsController = {

  // add new thoughts
  addThought({ body }, res) {
    Thoughts.create(body)
      .then(thoughts => {
        console.log(body.userId);
        return Users.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: thoughts._id } },
          { new: true }
        )
          .then(thoughts => {
            if (!thoughts) {
              res.status(404).json({ message: "no user with that id" });
              return;
            }
            return res.json(thoughts);
          })
      })
  },

  // get all thoughts
  getThoughts(req, res) {
    Thoughts.find({})
      .select('-__v')
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err))
  },

  getThoughtById({ params }, res) {
    Thoughts.findOne({ _id: params.thoughtId })
      .select('-__v')
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  updateThoughtById({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $set: body },
      { new: true, runValidators: true }
    ).then((thoughts) => {
      if (!thoughts) {
        return res.status(404).json({ message: "no thought with that id" })
      }
      return res.json(thoughts);
    })
  },

  deleteThoughtById({ params }, res) {
    Thoughts.findOneAndRemove({ _id: params.thoughtId })
      .then(thoughts => {
        if (!thoughts) {
          res.status(404).json({ message: "no thought found" })
          return;
        }
        Users.findOneAndUpdate(
          { thoughts: params.thoughtId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true, runValidators: true }
        ).then(() => res.json({ message: "succesfully deleted the thought" }))
          .catch((err) => res.status(500).json(err));
      })
  },

  addReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    ).then((thoughts) => {
      if (!thoughts) {
        return res.status(404).json({ message: "not added" });
      }
      return res.json(thoughts);
    })
  },

  deleteReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: body.reactionId } } },
      { new: true, runValidators: true }
    ).then((thoughts) => {
      if (!thoughts) {
        return res.status(404).json({ message: "no thoughts with that id" })
      }
      return res.json(thoughts);
    })
  },

}

module.exports = thoughtsController;