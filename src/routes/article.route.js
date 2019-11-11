import express from 'express';
import Article from '../controller/ariticle.controller';
import Authentication from '../middleware/Auth';

const router = express.Router();

router.post('/articles', Authentication.verify_token, Article.add_article);
router.get('/articles', Authentication.verify_token, Article.get_all_article_table);
router.get('/articles/:article_id', Authentication.verify_token, Article.get_article_by_id);
router.put('/articles/:article_id', Authentication.verify_token, Article.update_article);
router.delete('/articles/:article_id', Authentication.verify_token, Article.delete_article);

export default router;