import db from '../model/db';

const GiftComment = {
    async add_comment(req, res) {
        const { gift_id } = req.params
        const { user_id } = req.user
        let { comment } = req.body
        let { created_on } = req.body;
        created_on = new Date();
        const find_gift = {
            text: `SELECT FROM gifts WHERE gift_id = $1`,
            values: [gift_id]
        };

        try {
            const { rows } = await db.query(find_gift);
            if (!rows) {
                return res.status(400).json({
                    error: 'error',
                    message: 'Not Found'
                })
            }
            const post_comment = {
                text: `INSERT INTO giftcomments(gift_id, comment, created_by, created_on) 
                VALUES($1, $2, $3, $4) RETURNING *`,
                values: [gift_id, comment, user_id, created_on]
            };
            const { rows: rowsInsert } = await db.query(post_comment);
            return res.status(201).json({
                status: 'Success',
                data: {
                    message: 'Comment successfully created',
                    created_on: rowsInsert[0].created_on,
                    giftTitle: rows[0].title,
                    gift: rows[0].gifts,
                    comment: rowsInsert[0].comment
                }
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