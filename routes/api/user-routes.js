const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  addFriend,
  deleteFriendById
} = require('../../controllers/users-controller');

router
  .route('/:userId')
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

router.route('/').get(getUsers).post(createUser);

router.route('/:userId/friends/:friendId').delete(deleteFriendById).post(addFriend);

module.exports = router;