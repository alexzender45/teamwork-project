import { create_user_table } from './user.model';
import { create_gift_table } from './gift.model';
import { create_article_table } from './articles.model';
import { create_article_comment_table } from './comment.model';


const createTables = async () => {
    await create_user_table();
    await create_article_table();
    await create_gift_table();
    await create_article_comment_table()
}

export default createTables;

