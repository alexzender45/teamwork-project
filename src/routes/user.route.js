import express from 'express';
import User from '../controller/user.controller';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import tokenValidator from '../middleware/Auth';

const router = express.Router();

router.post('/create_user', tokenValidator.validateAdminToken, User.create);
router.post('/signin', User.login);

export default router;
