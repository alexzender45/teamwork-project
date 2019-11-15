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

const create_gift_comment_table = () => {
    // users
    const GiftComments = `CREATE TABLE IF NOT EXISTS 
  giftComments (
    comment_id SERIAL PRIMARY KEY,
    gift_id INT NOT NULL,
    comment VARCHAR (500) NOT NULL,
    created_by VARCHAR(128) NOT NULL,
    created_on TIMESTAMP DEFAULT Now(),
    FOREIGN KEY (gift_id) REFERENCES gifts(gift_id)
   )`;

    pool.query(GiftComments).then((res) => {
        logger(res);
        logger('giftComments');
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
const drop_gift_comment_table = async () => {
    const client = await pool.connect();
    const queryText = 'DROP TABLE IF EXISTS GiftComment';
    try {
        console.log('Dropping GiftComment table');
        const response = await client.query(queryText);
        logger(response);
    } catch (error) {
        logger(error);
    } finally {
        client.release();
    }
};
const post_comment = `INSERT INTO giftComments(gift_id, comment, created_by, created_on) 
    VALUES($1, $2, $3, $4) returning *`
const find_gift = `SELECT FROM gifts WHERE gift_id = $1`

pool.on('remove', () => {
    logger();
    process.exit(0);
});

export {
    create_gift_comment_table,
    drop_gift_comment_table,
    post_comment,
    find_gift
}