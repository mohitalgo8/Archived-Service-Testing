const mysql = require('mysql2/promise');

require('dotenv').config()

const dbConfig = {
  host: "",
  user: "",
  password: ""
};

const pool = mysql.createPool(dbConfig);

const readFromMySQL = async (query) => {
  console.log(query);
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(query);
    connection.release();
    return rows;
  } catch (err) {
    console.log(err)
    return []
  }
};

async function test(){
    let rrr = await readFromMySQL("SELECT * FROM mainDB.table1")
    console.log(rrr)
}

// test();

/*
**********OUTPUT**************
    [
        { timestamp: 2022-01-22T18:30:00.000Z, name: 'b' },
        { timestamp: 2022-03-18T18:30:00.000Z, name: 'g' },
        { timestamp: 2022-12-31T18:30:00.000Z, name: 'a' },
        { timestamp: 2023-08-19T18:30:00.000Z, name: 'd' },
        { timestamp: 2023-10-21T18:30:00.000Z, name: 'f' },
        { timestamp: 2023-12-31T18:30:00.000Z, name: 'e' },
        { timestamp: 2024-09-21T18:30:00.000Z, name: 'c' }
    ]
*/


module.exports = {
  readFromMySQL,
}