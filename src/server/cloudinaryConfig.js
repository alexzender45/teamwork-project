import { config, uploader } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const cloudinaryConfig = (req, res, next) => {
    config({
        cloud_name: 'dloddsbxf',
        api_key: 438128456556661,
        api_secret: 'FwNhupQAGFccpEW9DlOSJ1N_O6U',
    });
    next();
}
export { cloudinaryConfig, uploader };