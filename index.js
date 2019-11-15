import express from 'express';
import bodyParser from 'body-parser';
import Debug from 'debug';
import cors from 'cors';
import dotenv from 'dotenv';
import user from './src/routes/user.route';
import article from './src/routes/article.route';
import comment from './src/routes/articleComment.route';
import giftComment from './src/routes/giftComment.route';
import gift from './src/routes/gift.route';
import { cloudinaryConfig } from './src/server/cloudinaryConfig';

dotenv.config();
const app = express();
const logger = new Debug('http');


app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('*', cloudinaryConfig);

app.use('/api/v1/auth', user);
app.use('/api/v1', article);
app.use('/api/v1', gift);
app.use('/api/v1', comment);
app.use('/api/v1', giftComment);



app.get('', (req, res) => {
  res.send('connected');
});
const port = process.env.PORT || 3000;
app.listen(port, () => logger(`App runing on ${port}`));

module.exports = app;