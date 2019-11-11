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

const create_article_table = () => {
    // users
    const Articles = `CREATE TABLE IF NOT EXISTS 
  articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR (128) NOT NULL,
    author_id INT NOT NULL,
    article VARCHAR(128) NOT NULL,
    created_on TIMESTAMP DEFAULT Now(),
    FOREIGN KEY (author_id) REFERENCES users (user_id) ON UPDATE CASCADE
   )`;

    pool.query(Articles).then((res) => {
        logger(res);
        logger('articles');
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
const drop_article_table = async () => {
    const client = await pool.connect();
    const queryText = 'DROP TABLE IF EXISTS Articles';
    try {
        console.log('Dropping Articles table');
        const response = await client.query(queryText);
        logger(response);
    } catch (error) {
        logger(error);
    } finally {
        client.release();
    }
};

const create_article_query = `INSERT INTO 
      articles(title, article, author_id, created_on) 
      VALUES($1, $2, $3, $4) 
      returning *`;

const get_all_article_query = 'SELECT * FROM articles ORDER BY created_on DESC';
const get_article_by_id = 'SELECT * FROM articles WHERE article_id = $1';
const update_article = 'UPDATE articles SET title = $1, article = $2 WHERE article_id = $3 AND author_id = $4 returning *';
const delete_article = 'DELETE FROM articles WHERE article_id = $1 AND author_id = $2 returning *';


pool.on('remove', () => {
    logger();
    process.exit(0);
});

export {
    create_article_table,
    drop_article_table,
    get_all_article_query,
    create_article_query,
    update_article,
    delete_article,
    get_article_by_id
}