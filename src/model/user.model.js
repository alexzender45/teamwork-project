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

const create_user_table = () => {
  // users
  const Users = `CREATE TABLE IF NOT EXISTS 
  users (
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
    modified_on TIMESTAMP NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT ('FALSE')
   )`;

  pool.query(Users).then((res) => {
    logger(res);
    logger('users');
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
const drop_user_table = async () => {
  const client = await pool.connect();
  const queryText = 'DROP TABLE IF EXISTS Users';
  try {
    console.log('Dropping Users table');
    const response = await client.query(queryText);
    logger(response);
  } catch (error) {
    logger(error);
  } finally {
    client.release();
  }
};

const create_user = `INSERT INTO 
      users(first_name, last_name, email, password, gender, job_role, department, address, created_on, modified_on, is_admin) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      returning *`;

const login_user = 'SELECT * FROM users WHERE email = $1';

pool.on('remove', () => {
  logger();
  process.exit(0);
});

export { create_user_table, drop_user_table, create_user, login_user }