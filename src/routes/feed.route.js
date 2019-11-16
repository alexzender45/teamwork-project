import express from 'express';
import Feed from '../controller/feed.controller';
import Authentication from '../middleware/Auth';

const router = express.Router();

router.get('/feed', Authentication.verify_token, Feed.get_all_feed_table);

export default router;