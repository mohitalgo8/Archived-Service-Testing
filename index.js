import { pool1, pool2 } from "./database.js";

async function getTables(pool) {
  const [rows] = await pool.query("SHOW TABLES");
  return rows.map((row) => Object.values(row)[0]);
}

async function createTableIfNotExists(connection1, connection2, tableName) {
  // Get the CREATE TABLE statement from the active database
  const [createTableResult] = await connection1.query(
    `SHOW CREATE TABLE ${tableName}`
  );
  const createTableSQL = createTableResult[0]["Create Table"];

  // Execute the CREATE TABLE statement in the archived database
  await connection2.query(createTableSQL);
}

async function migrateTableData(
  connection1,
  connection2,
  tableName,
  cutoffDate
) {
  try {
    // Check if the table exists in the archived database, if not create it
    const [rows] = await connection2.query(`SHOW TABLES LIKE '${tableName}'`);
    if (rows.length === 0) {
      console.log("Creating new Table");
      await createTableIfNotExists(connection1, connection2, tableName);
    }

    console.log("date : ", cutoffDate);

    // Insert data from active to archived
    const [data] = await connection1.query(
      `SELECT * FROM ${tableName} WHERE timestamp < ? `,
      [cutoffDate]
    );

    if (data.length > 0) {
      // Insert data into archived database
      const columns = Object.keys(data[0]).join(", ");
      const values = data
        .map(
          (row) =>
            `(${Object.values(row)
              .map((value) => connection2.escape(value))
              .join(", ")})`
        )
        .join(", ");
      const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES ${values}`;
      await connection2.query(insertQuery);

      // Delete data from active
      // const deleteQuery = `DELETE FROM ${tableName} WHERE timestamp  < ?`;
      // await connection1.query(deleteQuery, [cutoffDate]);

      console.log(`Data from table ${tableName} migrated successfully.`);
    } else {
      console.log(`No data to migrate for table ${tableName}.`);
    }
  } catch (error) {
    console.error(`Error migrating data from table ${tableName}`);
    throw error; // Rethrow the error to trigger rollback
  }
}

async function migrateData() {
  const connection1 = await pool1.getConnection();
  const connection2 = await pool2.getConnection();
  const currentDate = new Date();
  const oneYearAgo = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours(),
    currentDate.getMinutes(),
    currentDate.getSeconds()
  );
  const oneYearAgoStr = `${oneYearAgo.getFullYear()}-${String(
    oneYearAgo.getMonth() + 1
  ).padStart(2, "0")}-${String(oneYearAgo.getDate()).padStart(2, "0")} ${String(
    oneYearAgo.getHours()
  ).padStart(2, "0")}:${String(oneYearAgo.getMinutes()).padStart(
    2,
    "0"
  )}:${String(oneYearAgo.getSeconds()).padStart(2, "0")}`;

  try {
    // Start transaction for both databases
    await connection1.beginTransaction();
    await connection2.beginTransaction();

    const tables = await getTables(connection1);
    for (const table of tables) {
      await migrateTableData(connection1, connection2, table, oneYearAgoStr);
    }

    // Commit transaction for both databases
    await connection1.commit();
    await connection2.commit();

    console.log("Data migration completed.");
  } catch (error) {
    // Rollback transaction for both databases
    await connection1.rollback();
    await connection2.rollback();
    console.error("Error during data migration:", error);
  } finally {
    connection1.release();
    connection2.release();
  }
}

migrateData();
// Export the migrateData function
export { migrateData };
