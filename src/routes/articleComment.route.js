import express from 'express';
import ArticleComment from '../controller/articleComment';
import tokenValidator from '../middleware/Auth';

const router = express.Router();

router.post('/articles/:article_id/comment', tokenValidator.validateUserToken, ArticleComment.add_comment);


export default router;