import express from 'express';
import bodyParser from 'body-parser';
import Debug from 'debug';
import cors from 'cors';
import dotenv from 'dotenv';
import user from './src/routes/user.route';

dotenv.config();
const app = express();
const logger = new Debug('http');


app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1/auth', user);


app.get('', (req, res) => {
    res.send('connected');
  });
  const port = process.env.PORT || 3000;
  app.listen(port, () => logger(`App runing on ${port}`));
  
  module.exports = app;