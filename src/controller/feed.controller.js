import db from '../model/db';
import { get_all_feed_query, get_all_feed_query2 } from '../model/tables.model'

const Feed = {
    // eslint-disable-next-line consistent-return
    async get_all_feed_table(req, res) {
        try {
            const { rows } = await db.query(get_all_feed_query);
            const { rows: rowsInsert } = await db.query(get_all_feed_query2);
            return res.status(200).json({
                status: 'success',
                data: {
                    articles: rows,
                    gifts: rowsInsert
                }
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