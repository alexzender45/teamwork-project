//import { drop_user_table } from './user.model';
import { drop_article_table } from './tables.model';
//import { drop_gift_table } from './gift.model';
//import { drop_article_comment_table } from './comment.model';
//import { drop_gift_comment_table } from './comment.model';



const dropTables = async () => {
    // await drop_gift_comment_table()
    // await drop_article_comment_table()
    // await drop_gift_table()
    await drop_article_table()
    //await drop_user_table()
}

export default dropTables;


