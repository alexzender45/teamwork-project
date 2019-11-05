import {create_user_table} from './user.model';


 const createTables = async () => {
    await create_user_table()
}

export default createTables;

