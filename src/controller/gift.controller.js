import { dataUri } from '../middleware/multer';
import { uploader } from '../server/cloudinaryConfig';
import {
    create_gift_query,
    get_all_gift_query,
    get_gift_by_id,
    update_gift,
    delete_gift
} from '../model/gift.model';
import db from '../model/db';


const Gift = {

    async add_gift(req, res) {
        const { body: { title }, user } = req;

        if (req.file) {
            const file = dataUri(req).content;
            return uploader.upload(file).then(async (result) => {
                const image = result.url;
                const values = [
                    title,
                    image,
                    user,
                    new Date()
                ]
                try {
                    // eslint-disable-next-line max-len
                    const { rows } = await db.query(create_gift_query, values);
                    const { gift_id, author_id } = rows[0];
                    return res.status(201).json({
                        status: 'success',
                        data: {
                            message: 'Article added successfully',
                            image_url: image,
                            gift_id,
                            author_id,
                            title,
                            created_on: new Date()
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
            })
        }
    },


    //Get all gifts

    async get_all_gift_query(req, res) {
        try {
            const { rows } = await db.query(get_all_gift_query);
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


    // get gift by id

    async get_gift_by_id(request, res) {
        try {
            const { rows } = await db.query(get_gift_by_id, [request.params.gift_id]);
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

    // Edit gifts
    async update_gift(req, res) {
        try {
            const { user, params: { gift_id }, body: { title, image } } = req;

            // if (!rows[0]) {
            //     return res.status(404).json({
            //         status: 'error',
            //         error: 'Not Found',
            //     });
            // }
            const values = [
                title,
                image,
                gift_id,
                user
            ];
            const response = await db.query(update_gift, values);
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
    async delete_gift(req, res) {
        try {
            const { user, params: { gift_id } } = req;
            const { rows } = await db.query(delete_gift, [gift_id, user]);
            if (!rows[0]) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Not Found',
                });
            }
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Gift successfully deleted',
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

}
export default Gift