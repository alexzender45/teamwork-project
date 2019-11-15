import db from '../model/db';

const ArticleComment = {
    async add_comment(req, res) {
        const { user, params: { article_id }, body: { comment, created_on } } = req;

        const find_article = {
            text: `SELECT FROM articles WHERE article_id = $1`,
            values: [article_id]
        };

        try {
            const { rows } = await db.query(find_article);
            if (!rows) {
                return res.status(400).json({
                    error: 'error',
                    message: 'Not Found'
                })
            }
            const post_comment = {
                text: `INSERT INTO comments(article_id, comment, created_by, created_on) 
                VALUES($1, $2, $3, $4) returning *`,
                values: [article_id, comment, user, created_on]
            };
            const response = await db.query(post_comment);
            const { comment_id } = response.rows[0];
            return res.status(201).json({
                message: 'Comment successfully created',
                comment_id,
                created_on: new Date(),
                article_id,

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

export default ArticleComment;