import express from 'express';
import Feed from '../controller/feed.controller';
import tokenValidator from '../middleware/Auth';

const router = express.Router();

router.get('/feed', tokenValidator.validateUserToken, Feed.get_all_feed_table);

export default router;