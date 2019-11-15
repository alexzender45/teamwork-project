/* eslint-disable camelcase */
import Debug from 'debug';

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const logger = new Debug('http');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

console.log('connected to the db');

const create_article_comment_table = () => {
    // users
    const ArticleComments = `CREATE TABLE IF NOT EXISTS 
  comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL,
    comment VARCHAR (500) NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    created_on TIMESTAMP DEFAULT Now(),
    FOREIGN KEY (article_id) REFERENCES articles(article_id)
   )`;

    pool.query(ArticleComments).then((res) => {
        logger(res);
        logger('comments');
        pool.end();
    }).catch((err) => {
        console.log(err);
        pool.end();
    });
};

/**
 * Drop Tables
 * @returns {*} void
 */
const drop_article_comment_table = async () => {
    const client = await pool.connect();
    const queryText = 'DROP TABLE IF EXISTS ArticleComment';
    try {
        console.log('Dropping ArticleComment table');
        const response = await client.query(queryText);
        logger(response);
    } catch (error) {
        logger(error);
    } finally {
        client.release();
    }
};


pool.on('remove', () => {
    logger();
    process.exit(0);
});

export {
    create_article_comment_table,
    drop_article_comment_table
}