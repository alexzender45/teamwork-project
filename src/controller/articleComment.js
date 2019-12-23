import db from '../model/db';

const ArticleComment = {
    async add_comment(req, res) {
        const { article_id } = req.params
        const { user_id } = req.user
        let { comment } = req.body
        let { created_on } = req.body;
        created_on = new Date();
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
                VALUES($1, $2, $3, $4) RETURNING *`,
                values: [article_id, comment, user_id, created_on]
            };
            const { rows: rowsInsert } = await db.query(post_comment);
            return res.status(201).json({
                status: 'Success',
                data: {
                    message: 'Comment successfully created',
                    created_on: rowsInsert[0].created_on,
                    articleTitle: rows[0].title,
                    article: rows[0].article,
                    comment: rowsInsert[0].comment,
                    created_by: rowsInsert[0].created_by
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: 'error',
                error: 'Something went wrong, try again',
            });
        }
    }, 
    async getAllComments(req, res){
        const { article_id } = req.params;
        try {
            const get_comment = {
                text: `SELECT * FROM comments where article_id = $1`,
                values:[article_id]

            };
            const { rows } = await db.query(get_comment);
            return res.status(200).json({
                status: 'Success',
                data: {
                    message: 'Comment successfully Retrive',
                    comment: rows
                }
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