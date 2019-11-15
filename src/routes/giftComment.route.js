import express from 'express';
import GiftComment from '../controller/giftComment';
import Authentication from '../middleware/Auth';

const router = express.Router();

router.post('/gifts/:gift_id/comment', Authentication.verify_token, GiftComment.add_comment);


export default router;