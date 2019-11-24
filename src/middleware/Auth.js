import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../model/db';


dotenv.config();
const { SECRET } = process.env;

async function queryUser(decoded) {
  const queryText = 'SELECT * FROM users WHERE user_id = $1';
  const { rows } = await db.query(queryText, [decoded.user_id]);
  return rows;
}


export const tokenValidator = {
  async validateUserToken(req, res, next) {
    const { token } = req.headers;
    if (token) {
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({
          status: 'error',
          error: 'Failed to authenticate token',
        });
        const rows = await queryUser(decoded);
        if (rows[0]) {
          req.user = rows[0];
          req.decoded = decoded;
          return next();
        }
        return res.status(401).json({
          status: 'error',
          error: 'Not a valid user',
        });
      });
    } else {
      return res.status(400).json({
        status: 'error', error: 'Token not provided',
      });
    }
  },


  async validateAdminToken(req, res, next) {
    const { token } = req.headers;

    if (token) {
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: 'error',
            error: 'Failed to authenticate token',
          });
        }
        const rows = await queryUser(decoded);

        if (rows[0] && rows[0].is_admin === true) {
          req.user = rows[0];
          req.decoded = decoded;
          return next();
        }
        return res.status(403).json({
          status: 'error',
          error: 'Not an admin user',
        });
      });
    } else {
      return res.status(400).json({
        status: 'error',
        error: 'token not provided',
      });
    }
  },

}

export default tokenValidator;