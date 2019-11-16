import db from '../model/db';
import { get_all_feed_query } from '../model/gift.model'

const Feed = {
    // eslint-disable-next-line consistent-return
    async get_all_feed_table(req, res) {
        try {
            const { rows } = await db.query(get_all_feed_query);
            return res.status(200).json({
                status: 'success',
                data: rows,
            });
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: 'error',
                error: 'Something went wrong, try again',
            });
        }
    },
}

export default Feed