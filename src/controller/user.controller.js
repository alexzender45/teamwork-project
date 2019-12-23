/* eslint-disable camelcase */
import moment from 'moment';
import db from '../model/db';
import validate from '../helper/validate';
import Helper from '../helper/Helper';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { create_user, login_user, get_user_by_id } from '../model/tables.model';

dotenv.config();
const { SECRET } = process.env;

const expirationTime = '7hrs';
const User = {
  /**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */

  async create(req, res) {
    const {
      user_id, first_name, last_name, email, password, gender, job_role, department, address
    } = req.body;

    if (!first_name || !last_name || !email || !password || !gender || !job_role || !department || !address) {
      return res.status(400).json({
        status: 'error',
        error: 'All fields are required',
      });
    }

    // eslint-disable-next-line no-unused-expression

    if (!validate.isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        error: 'Please enter a valid email address',
      });
    }

    if (validate.passwordLength(password)) {
      return res.status(400).json({
        status: 'error',
        error: 'Password length too short',
      });
    }

    const hash_password = Helper.hash_password(req.body.password);

    const values = [
      first_name,
      last_name,
      email,
      hash_password,
      gender,
      job_role,
      department,
      address,
      moment(new Date()),



    ];

    try {
      const { rows: rowsInsert } = await db.query(create_user, values);
      const token = jwt.sign({ email, user_id }, SECRET, { expiresIn: expirationTime });

      return res.status(201).json({
        status: 'success',
        data: {
          message: "User account successfully created",
          token,
          user_id: rowsInsert[0].user_id,
        },
      });
    } catch (error) {
      console.log(error);
      // check if email already exist
      if (error.routine === '_bt_check_unique') {
        return res.status(409).json({
          status: 'error',
          error: 'User with the email already exist',
        });
      }
      return res.status(500).json({
        status: 'error',
        error: 'Oops! Something went wrong, try again',
      });
    }
  },

  /**
   * Login
  * @param {object} res
  * @returns {object} user object
  */
  async login(req, res) {
    const { password, email } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        error: 'Some values are missing',
      });
    }

    if (!validate.isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        error: 'Please enter a valid email address',
      });
    }

    try {
      const { rows } = await db.query(login_user, [email]);
      if (!rows[0]) {
        res.status(401).json({
          status: 'error',
          error: 'Some values are missing',
        });
      }

      if (!Helper.compare_password(rows[0].password, password)) {
        res.status(400).json({
          status: 'error',
          error: 'Email or Password not correct',
        });
      }
      // generate token
      const token = jwt.sign({ user_id: rows[0].user_id, email: rows[0].email }, SECRET, { expiresIn: expirationTime });
      return res.status(201).json({
        status: 'success',
        data: {
          token,
          user_id: rows[0].user_id
        },
      });
    } catch (error) {
      console.log(error)
      return res.status(401).json({
        status: 'error',
        error: 'The credentials you provided is incorrect',
      });
    }
  },
  async get_user_by_id(request, res) {
    try {
        const { rows } = await db.query(get_user_by_id, [request.params.user_id]);
        if (!rows[0]) {
            return res.status(404).json({
                status: 'error',
                error: 'Not Found',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: {
                last_name: rows[0].last_name,
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 'error',
            error: 'Something went wrong, try again',
        });
    }
}
}

export default User;