import express from 'express';
import Gift from '../controller/gift.controller';
import Authentication from '../middleware/Auth';
import { multerUploads } from '../middleware/multer';

const router = express.Router();

router.post('/gifts', Authentication.verify_token, multerUploads, Gift.add_gift);
router.get('/gifts', Authentication.verify_token, Gift.get_all_gift_query);
router.get('/gifts/:gift_id', Authentication.verify_token, Gift.get_gift_by_id);
router.put('/gifts/:gift_id', Authentication.verify_token, Gift.update_gift);
router.delete('/gifts/:gift_id', Authentication.verify_token, Gift.delete_gift);

export default router;