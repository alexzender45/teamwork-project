// import Debug from 'debug';

// const { Pool } = require('pg');
// const dotenv = require('dotenv');

// dotenv.config();
// const logger = new Debug('http');

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });

// console.log('connected to the db');

// const create_gift_table = () => {
//     // users
//     const Gifts = `CREATE TABLE IF NOT EXISTS 
//   gifts (
//     gift_id SERIAL PRIMARY KEY,
//     image VARCHAR (128) NOT NULL,
//     title VARCHAR(128) NOT NULL,
//     created_on TIMESTAMP DEFAULT Now(),
//     modified_on TIMESTAMP NOT NULL,
//    )`;

//     pool.query(Gifts).then((res) => {
//         logger(res);
//         logger('gifts');
//         pool.end();
//     }).catch((err) => {
//         console.log(err);
//         pool.end();
//     });
// };

// /**
//  * Drop Tables
//  * @returns {*} void
//  */
// const drop_gift_table = async () => {
//     const client = await pool.connect();
//     const queryText = 'DROP TABLE IF EXISTS Gifts';
//     try {
//         console.log('Dropping Gifts table');
//         const response = await client.query(queryText);
//         logger(response);
//     } catch (error) {
//         logger(error);
//     } finally {
//         client.release();
//     }
// };

// const create_gift = `INSERT INTO 
//       gifts(image, title, created_on, modified_on) 
//       VALUES($1, $2, $3, $4) 
//       returning *`;

// pool.on('remove', () => {
//     logger();
//     process.exit(0);
// });

// export { create_gift_table, drop_gift_table, create_gift }