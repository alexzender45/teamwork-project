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

const create_gift_table = () => {
    // users
    const Gifts = `CREATE TABLE IF NOT EXISTS 
  gifts (
    gift_id SERIAL PRIMARY KEY,
    title VARCHAR (128) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    created_on TIMESTAMP DEFAULT Now(),
    FOREIGN KEY (author_id) REFERENCES users(user_id)
   )`;

    pool.query(Gifts).then((res) => {
        logger(res);
        logger('gifts');
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
const drop_gift_table = async () => {
    const client = await pool.connect();
    const queryText = 'DROP TABLE IF EXISTS Gifts';
    try {
        console.log('Dropping Gifts table');
        const response = await client.query(queryText);
        logger(response);
    } catch (error) {
        logger(error);
    } finally {
        client.release();
    }
};
const create_gift_query = `INSERT INTO gifts(title, image_url, author_id, created_on) 
 VALUES($1, $2, $3, $4) returning *`;

const get_all_gift_query = 'SELECT * FROM gifts ORDER BY created_on DESC';
const get_gift_by_id = 'SELECT * FROM gifts WHERE gift_id = $1';
const update_gift = 'UPDATE gifts SET title = $1, image_url = $2 WHERE gift_id = $3 AND author_id = $4 returning *';
const delete_gift = 'DELETE FROM gifts WHERE gift_id = $1 AND author_id = $2 returning *';


pool.on('remove', () => {
    logger();
    process.exit(0);
});

export {
    create_gift_table,
    create_gift_query,
    drop_gift_table,
    get_all_gift_query,
    update_gift,
    delete_gift,
    get_gift_by_id
}