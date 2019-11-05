import {drop_user_table} from './user.model';



 const dropTables = async() => { 
    await drop_user_table()
}

export default dropTables;