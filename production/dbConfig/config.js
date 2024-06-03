const mysql = require("mysql2/promise");

require("dotenv").config();

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  idleTimeout: 600000,
};
const dbConfig2 = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE2,
  idleTimeout: 600000,
};

const pool1 = mysql.createPool(dbConfig);
const pool2 = mysql.createPool(dbConfig2);

const readFromMySQL = async (query) => {
  console.log(query);
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(query);
    connection.release();
    return rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

async function test() {
  let rrr = await readFromMySQL("SELECT * FROM mab");
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
  pool1,
  pool2,
};
