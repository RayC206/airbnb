const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Image, Review } = require('../../db/models');

const router = express.Router();

//Error variable to be called on Forbidden errors
const authorizationError = {
  "message": "Authorization Required",
  "statusCode": 403
};


//edit a review
router.put('/:reviewId', requireAuth,  async (req, res) => {
  let reviewId = req.params.reviewId;
  let reviewParams = req.body;
  let currentUserId = req.user.id;

  // Review must belong to the current user
  let review = await Review.findByPk(reviewId);
  if (review.userId !== currentUserId) {
    return res.json(authorizationError);
  }

  review = await Review.update(reviewParams, {
    where: {
      id: reviewId
    }
  });
  review = await Review.findByPk(reviewId);
  return res.json(review);
});

//delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  let reviewId = req.params.reviewId;
  let currentUserId = req.user.id;

  // Review must belong to the current user
  let review = await Review.findByPk(reviewId);
  if (review.userId !== currentUserId) {
    return res.json(authorizationError);
  }

  await Review.destroy({
    where: {
      id: reviewId
    }
  });
  return res.json({
    message: 'Successfully deleted',
    statusCode: 200
  });
});

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const currentUserId = req.user.id;
  const reviewId = req.params.reviewId;


  let review  = await Review.findByPk(reviewId);
  //if review doesnt exist
  if (!review){
    return res.status(404).json({
      "message": "Review does not exist"
    });
  }

  //if currentUser not associated with review id
  if (review.userId !== currentUserId) {
    return res.json(authorizationError);
  }

  imageParams = req.body;
  imageParams.reviewId = reviewId;

  let { count } = await Image.findAndCountAll({
    where: {
      reviewId: reviewId
    }
  });
  if (count >= 10) {
    return res.status(400).json({
      "message": "Maximum number of images reached"
    });
  }

  let image = await Image.create(imageParams);
  image = await Image.findByPk(image.id);

  return res.json(image);
});


module.exports = router;
