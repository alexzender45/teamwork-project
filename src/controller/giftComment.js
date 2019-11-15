import db from '../model/db';
import { post_comment } from '../model/giftComments';
import { find_gift } from '../model/giftComments'

const GiftComment = {
    async add_comment(req, res) {
        const { user, params: { gift_id }, body: { comment, created_on } } = req;
        try {
            const values = [gift_id]
            const { rows } = await db.query(find_gift, values);
            if (!rows) {
                return res.status(400).json({
                    error: 'error',  message: 'Not Found'
                })
            }
            const values1 = [gift_id, comment, user, created_on]
            const response = await db.query(post_comment, values1);
            const { comment_id } = response.rows[0];
            return res.status(201).json({
                message: 'Comment successfully created', comment_id, created_on: new Date(), gift_id, user, comment
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                 status: 'error', error: 'Something went wrong, try again',
            });
        }
    }
}

export default GiftComment;