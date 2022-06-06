const router = require('express').Router();

const {
  addThought,
  getThoughts,
  getThoughtById,
  updateThoughtById,
  deleteThoughtById,
  addReaction,
  deleteReaction
} = require('../../controllers/thoughts-controller');

router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThoughtById)
  .delete(deleteThoughtById);

router.route('/').get(getThoughts).post(addThought);

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

router.route('/:thoughtId/reactions').post(addReaction);

module.exports = router;