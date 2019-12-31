import express from 'express';
import GiftComment from '../controller/giftComment';
import tokenValidator from '../middleware/Auth';

const router = express.Router();

router.post('/gifts/:gift_id/comment', tokenValidator.validateUserToken, GiftComment.add_comment);
router.get('/gifts/:gift_id/comment', tokenValidator.validateUserToken, GiftComment.getAllGiftComments);

export default router;