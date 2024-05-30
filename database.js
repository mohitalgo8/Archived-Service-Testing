import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const activeDbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  idleTimeout: 600000,
};
const archivedDbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE2,
  idleTimeout: 600000,
};

const pool1 = mysql.createPool(activeDbConfig).promise();
const pool2 = mysql.createPool(archivedDbConfig).promise();

export { pool1, pool2 };
