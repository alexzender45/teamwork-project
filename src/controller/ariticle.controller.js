/* eslint-disable camelcase */
import db from '../model/db';
import {
    create_article_query,
    get_all_article_query,
    delete_article,
    update_article,
    get_article_by_id
}
    from '../model/articles.model';


const Article = {
    /**
    * Admin can create trip
    * @param {object} req
    * @param {object} res
    * @returns {object} bus object
    */
    async add_article(req, res) {
        // eslint-disable-next-line no-console
        // eslint-disable-next-line object-curly-newline
        const { body: { title, article }, user } = req;
        // eslint-disable-next-line prefer-const
        if (!title || !article) {
            return res.status(400).json({
                status: 'error',
                error: 'Title and Article is reaquired',
            });
        }

        const values = [
            title,
            article,
            user,
            new Date()
        ];

        try {
            // eslint-disable-next-line max-len
            const { rows } = await db.query(create_article_query, values);
            const { article_id, author_id } = rows[0];
            return res.status(201).json({
                status: 'success',
                data: {
                    message: 'Article added successfully',
                    article_id,
                    title,
                    article,
                    author_id,
                    created_on: new Date(),
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
                data: rows,
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


    // Edit articles
    async update_article(req, res) {
        try {
            const { user, params: { article_id }, body: { title, article } } = req;

            // if (!rows[0]) {
            //     return res.status(404).json({
            //         status: 'error',
            //         error: 'Not Found',
            //     });
            // }
            const values = [
                title || rows[0].title,
                article || rows[0].article,
                article_id,
                user
            ];
            const response = await db.query(update_article, values);
            return res.status(200).json({
                status: 'success',
                message: 'Article successfully Updated',
                data: response.rows[0]
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
            const { user, params: { article_id } } = req;
            const { rows } = await db.query(delete_article, [article_id, user]);
            if (!rows[0]) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Not Found',
                });
            }
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