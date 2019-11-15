import express from 'express';
import ArticleComment from '../controller/articleComment';
import Authentication from '../middleware/Auth';

const router = express.Router();

router.post('/articles/:article_id/comment', Authentication.verify_token, ArticleComment.add_comment);


export default router;