const { Router } = require('express');
const feedbackRoute = Router();

const feedbackController = require('../controllers/feedback.controller');
const authentication = require('../middleware/authentication');

feedbackRoute.delete('/:id', authentication.checkToken, feedbackController.deleteFeedback);
feedbackRoute.post('/', authentication.checkToken, feedbackController.createFeedback);
feedbackRoute.get('/', authentication.checkToken, feedbackController.getFeedbackByUserId);

module.exports = feedbackRoute;