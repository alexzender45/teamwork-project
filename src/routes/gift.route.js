import express from 'express';
import Gift from '../controller/gift.controller';
import tokenValidator from '../middleware/Auth';
import { multerUploads } from '../middleware/multer';

const router = express.Router();

router.post('/gifts', tokenValidator.validateUserToken, multerUploads, Gift.add_gift);
router.get('/gifts', tokenValidator.validateUserToken, Gift.get_all_gift_query);
router.get('/gifts/:gift_id', tokenValidator.validateUserToken, Gift.get_gift_by_id);
router.delete('/gifts/:gift_id', tokenValidator.validateUserToken, Gift.delete_gift);

export default router;