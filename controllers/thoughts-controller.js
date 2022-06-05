const { Thoughts, Users } = require('../models');

const thoughtsController = {

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


}