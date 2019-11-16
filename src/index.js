import express from 'express';
import bodyParser from 'body-parser';
import Debug from 'debug';
import cors from 'cors';
import dotenv from 'dotenv';
import user from './routes/user.route';
import article from './routes/article.route'
import comment from './routes/articleComment.route';
import giftComment from './routes/giftComment.route';
import gift from './routes/gift.route';
import feed from './routes/feed.route';
import { cloudinaryConfig } from './server/cloudinaryConfig';

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
app.use('/api/v1', feed);



app.get('', (req, res) => {
  res.send('connected');
});
const port = process.env.PORT || 3000;
app.listen(port, () => logger(`App runing on ${port}`));

module.exports = app;