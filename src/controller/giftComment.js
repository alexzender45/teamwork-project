import db from '../model/db';

const GiftComment = {
    async add_comment(req, res) {
        const { user, params: { gift_id }, body: { comment, created_on } } = req;

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
                text: `INSERT INTO giftComments(gift_id, comment, created_by, created_on) 
                VALUES($1, $2, $3, $4) returning *`,
                values: [gift_id, comment, user, created_on]
            };
            const response = await db.query(post_comment);
            const { comment_id } = response.rows[0];
            return res.status(201).json({
                message: 'Comment successfully created',
                comment_id,
                created_on: new Date(),
                gift_id,
                user,
                comment
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: 'error',
                error: 'Something went wrong, try again',
            });
        }
    }
}

export default GiftComment;