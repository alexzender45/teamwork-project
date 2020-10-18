import express from 'express';
import User from '../controller/user.controller';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import tokenValidator from '../middleware/Auth';

const router = express.Router();

router.post('/create_user', User.create);
router.post('/signin', User.login);
router.get('/user/:user_id',tokenValidator.validateUserToken, User.get_user_by_id);

export default router;
