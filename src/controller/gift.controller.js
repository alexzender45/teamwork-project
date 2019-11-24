import { dataUri } from '../middleware/multer';
import { uploader } from '../server/cloudinaryConfig';
import {
    create_gift_query,
    get_all_gift_query,
    get_gift_by_id
} from '../model/tables.model';
import db from '../model/db';


const Gift = {

    async add_gift(req, res) {
        const { body: { title } } = req;
        const { user_id } = req.user

        if (req.file) {
            const file = dataUri(req).content;
            return uploader.upload(file).then(async (result) => {
                const image = result.url;
                const values = [
                    title,
                    image,
                    user_id,
                    new Date()
                ]
                try {
                    // eslint-disable-next-line max-len
                    const { rows } = await db.query(create_gift_query, values);
                    const { gift_id, user_id } = rows[0];
                    return res.status(201).json({
                        status: 'success',
                        data: {
                            message: 'Article added successfully',
                            image_url: image,
                            gift_id,
                            user_id,
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
                data: {
                    rows
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


    // Delete articles
    async delete_gift(req, res) {
        try {
            const { gift_id } = req.params;
            const { user_id } = req.user
            const selectGift = {
                text: 'SELECT * FROM gifts WHERE created_by = $1 AND gift_id= $2',
                values: [user_id, gift_id],
            };
            const { rows } = await db.query(selectGift);
            if (!rows[0]) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Not Found',
                });
            }
            const deleteGift = {
                text: 'DELETE FROM gifts WHERE gift_id= $1',
                values: [gift_id],
            };
            await db.query(deleteGift);
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