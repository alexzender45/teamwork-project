/* eslint-disable camelcase */
import db from '../model/db';
import {
    get_all_article_query,
    get_article_by_id,
}
    from '../model/tables.model';

 const maxlength = 70;

const Article = {
    /**
    * Admin can create trip
    * @param {object} req
    * @param {object} res
    * @returns {object} bus object
    */
    async add_article(req, res) {
        let { created_on } = req.body;
        created_on = new Date();

        const { body: { title, article } } = req;
        const { user_id } = req.user
        if (!title || !article) {
            return res.status(400).json({
                status: 'error',
                error: 'Title and Article is reaquired',
            });
        }
        if(title.length > maxlength){
            return res.status(400).json({
                status: 'error',
                error: 'Please make sure the title is less than 70'   
        })
    }

        const queryText = {
            text: 'SELECT * FROM articles WHERE title = $1',
            values: [title],
        };

        try {
            const { rows } = await db.query(queryText);
            if (rows[0]) {
                return res.status(401).json({
                    status: 'error',
                    error: 'Article already exists',
                });
            }
            const insertArticle = {
                text: 'INSERT INTO Articles (title, article, created_by, created_on) VALUES($1, $2, $3, $4) RETURNING *',
                values: [title, article, user_id, created_on],
            };
            // eslint-disable-next-line max-len
            const { rows: rowsInsert } = await db.query(insertArticle);
            return res.status(201).json({
                status: 'success',
                data: {
                    message: 'Article added successfully',
                    article_id: rowsInsert[0].article_id,
                    created_on: rowsInsert[0].created_on,
                    title: rowsInsert[0].title,
                },
            });
        } catch (error) {
            console.log(error);
            if (error.routine === 'ri_ReportViolation') {
                return res.status(400).json({
                    status: 'error',
                    error: 'No article with such ID found',
                });
            }
            return res.status(400).json({
                status: 'error',
                error: 'Something went wrong, try again or contact our engineers',
            });
        }
    },
    /**
     * Both Admin and User see all trips
     * @param {object} req
     * @param {object} res
     * @returns {object} bus object
     */
    // eslint-disable-next-line consistent-return
    async get_all_article_table(req, res) {
        try {
            const { rows } = await db.query(get_all_article_query);
            return res.status(200).json({
                status: 'success',
                data: {
                    rows,
                }
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error: 'Something went wrong, try again',
            });
        }
    },


    // get article by id

    async get_article_by_id(request, res) {
        try {
            const { rows } = await db.query(get_article_by_id, [request.params.article_id]);
            if (!rows[0]) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Not Found',
                });
            }
            return res.status(200).json({
                status: 'success',
                data: {
                    rows,
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


    // Edit articles
    async update_article(req, res) {
        try {
            const { params: { article_id }, body: { title, article } } = req;
            const { user_id } = req.user
            const selectArticle = {
                text: 'SELECT * FROM articles WHERE created_by = $1 AND article_id= $2',
                values: [user_id, article_id],
            };
            const { rows } = await db.query(selectArticle);
            if (!rows[0]) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Not Found',
                });
            }
            const update_article = {
                text: 'UPDATE articles SET title = $1, article = $2 WHERE article_id = $3',
                values: [title, article, article_id],
            };
            await db.query(update_article);
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Article successfully Updated',
                    title,
                    article
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: 'error',
                error: 'Something went wrong, try again',
            });
        }
    },



    // Delete articles
    async delete_article(req, res) {
        try {
            const { article_id } = req.params;
            const { user_id } = req.user
            const selectArticle = {
                text: 'SELECT * FROM articles WHERE created_by = $1 AND article_id= $2',
                values: [user_id, article_id],
            };
            const { rows } = await db.query(selectArticle);
            if (!rows[0]) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Not Found',
                });
            }
            const deleteArticle = {
                text: 'DELETE FROM articles WHERE article_id= $1',
                values: [article_id],
            };
            await db.query(deleteArticle);
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Article successfully deleted',
                },
            });
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: 'error',
                error: 'Something went wrong, try again',
            });
        }
    },

};

export default Article;