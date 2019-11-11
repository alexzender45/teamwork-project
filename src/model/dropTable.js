import { drop_user_table } from './user.model';
import { drop_article_table } from './articles.model';
//import { drop_gift_table } from './gift.model'



const dropTables = async () => {
    await drop_user_table();
    //await drop_gift_table()
    await drop_article_table()
}

export default dropTables;