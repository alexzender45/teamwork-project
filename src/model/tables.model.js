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
    const Tables = `DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      first_name VARCHAR (128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      email VARCHAR (254) UNIQUE NOT NULL,
      password VARCHAR(128) NOT NULL,
      gender VARCHAR(128) NOT NULL,
      job_role VARCHAR(128) NOT NULL,
      department VARCHAR(128) NOT NULL,
      address VARCHAR(128) NOT NULL,
      created_on TIMESTAMP DEFAULT Now(),
      is_admin BOOLEAN NOT NULL DEFAULT ('FALSE'),
      is_logged_in BOOLEAN NOT NULL DEFAULT ('FALSE')
     );
  
      DROP TABLE IF EXISTS articles CASCADE;
      CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR (128) NOT NULL,
      article VARCHAR NOT NULL,
      created_by INT NOT NULL REFERENCES users(user_id),
      created_on TIMESTAMP DEFAULT Now()
     );
  
  DROP TABLE IF EXISTS gifts CASCADE;
  CREATE TABLE gifts (
      gift_id SERIAL PRIMARY KEY,
      title VARCHAR (128) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      created_by INT NOT NULL REFERENCES users(user_id),
      created_on TIMESTAMP DEFAULT Now()
     );
  
     DROP TABLE IF EXISTS comments CASCADE;
     CREATE TABLE comments (
       comment_id SERIAL PRIMARY KEY,
       article_id SERIAL NOT NULL REFERENCES articles(article_id),
       comment VARCHAR  NOT NULL,
       created_by INT NOT NULL REFERENCES users(user_id),
       created_on TIMESTAMP DEFAULT Now()
      );
      
    DROP TABLE IF EXISTS giftcomments CASCADE;
    CREATE TABLE giftComments (
        comment_id SERIAL PRIMARY KEY,
        gift_id INT NOT NULL REFERENCES gifts(gift_id),
        comment VARCHAR NOT NULL,
        created_by SERIAL NOT NULL REFERENCES users(user_id),
        created_on TIMESTAMP DEFAULT Now()
       ) `;

    pool.query(Tables).then((res) => {
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
export const create_user = `INSERT INTO 
     users(first_name, last_name, email, password, gender, job_role, department, address, created_on) 
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     returning *`;

export const login_user = 'SELECT * FROM users WHERE email = $1';

export const create_gift_query = `INSERT INTO gifts(title, image_url, created_by, created_on) 
VALUES($1, $2, $3, $4) returning *`;

export const get_all_gift_query = 'SELECT * FROM gifts ORDER BY created_on DESC';
export const get_gift_by_id = 'SELECT * FROM gifts WHERE gift_id = $1';



export const get_all_feed_query = 'SELECT article_id, created_on, title, article, created_by FROM articles a ORDER BY created_on DESC';
export const get_all_feed_query2 = 'SELECT gift_id, created_on, title, image_url, created_by FROM gifts b ORDER BY created_on DESC';

// Articles 
export const create_article_query = `INSERT INTO 
     articles(title, article, created_on, created_by) 
     VALUES($1, $2, $3, $4) 
     returning *`;

export const get_all_article_query = 'SELECT * FROM articles ORDER BY created_on DESC';
export const get_article_by_id = 'SELECT * FROM articles WHERE article_id = $1';
export const update_article = 'UPDATE articles SET title = $1, article = $2 WHERE article_id = $3 returning *';
export const titles = 'SELECT * FROM articles WHERE title = $1';

// Gift Comment

export const post_comment = `INSERT INTO giftComments(gift_id, comment, created_by, created_on) 
   VALUES($1, $2, $3, $4) returning *`
export const find_gift = `SELECT FROM gifts WHERE gift_id = $1`

// User 


const drop_article_table = async () => {
    const client = await pool.connect();
    const queryText = 'DROP TABLE IF EXISTS Tables';
    try {
        console.log('Dropping Tables');
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
    create_article_table,
    drop_article_table,
}
