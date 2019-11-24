import express from 'express';
import Article from '../controller/ariticle.controller';
import tokenValidator from '../middleware/Auth';

const router = express.Router();

router.post('/articles', tokenValidator.validateUserToken, Article.add_article);
router.get('/articles', tokenValidator.validateUserToken, Article.get_all_article_table);
router.get('/articles/:article_id', tokenValidator.validateUserToken, Article.get_article_by_id);
router.patch('/articles/:article_id', tokenValidator.validateUserToken, Article.update_article);
router.delete('/articles/:article_id', tokenValidator.validateUserToken, Article.delete_article);

export default router;