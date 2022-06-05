const { Users, Thoughts } = require('../models');

const usersController = {

  // create new user
  createUser({ body }, res) {
    Users.create(body)
      .then(userData => {
        if (!userData) {
          return res.status(404).json({ message: "user not added" });
        }
        return res.json(userData);
      })
  },

  // get all users
  getUsers(req, res) {
    Users.find({})
      .populate("thoughts")
      .populate("friends")
      .select('__v')
      .then(userData => {
        if (!userData) {
          return res.status(404).json({ message: "no user with that id" });
        }
        return res.json(userData);
      })
  },

  // get user by id
  getUserById({ params }, res) {
    Users.findOne({ _id: params.userId })
      .populate("thoughts")
      .populate("friends")
      .select('__v')
      .then(userData => {
        if (!userData) {
          return res.status(404).json({ message: "no user with that id" });
        }
        return res.json(userData);
      })
  },

  // update user by id
  updateUserById({ params, body }, res) {
    Users.findOneAndUpdate(
      { _id: params.userId },
      { $set: body },
      { new: true, runValidators: true }
    ).then((userData) => {
      if (!userData) {
        return res.status(404).json({ message: "no user with that id" });
      }
      return res.json(userData);
    })
  },

  // delete user by id
  deleteUserById({ params }, res) {
    Users.findOneAndRemove(
      { _id: params.userID }
    ).then(userData => {
      if (!userData) {
        res.status(404).json({ message: "no user with that id" });
        return;
      }
      Users.updateMany(
        { _id: { $in: userData.friends } },
        { _pull: { $friends: params.userId } },
      ).then(() => {
        Thoughts.deleteMany(
          { username: userData.username }
        ).then(() => {
          res.json({ message: "deleted user and thoughts" });
        })
      })
    })
  },

  // add friend
  addFriend({ params }, res) {
    Users.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    ).then((userData) => {
      if (!userData) {
        return res.status(404).json({ message: "no user with that id" })
      }
      Users.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
      ).then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: "no user with that id" })
        }
        return res.json(userData);
      })
    })
  },


  // delete friend by id
  deleteFriendById({ params }, res) {
    Users.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
    ).then((userData) => {
      if (!userData) {
        return res.status(404).json({ message: "no user with that id" })
      }
      Users.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.userId } },
        { new: true, runValidators: true }
      ).then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: "no user with that id" })
        }
        return res.json(userData);
      })
    })
  }
}

module.exports = usersController;