import cron from "node-cron";
import { migrateData } from "./index.js";

cron.schedule(
  "0 23 * * *",
  async () => {
    console.log("Running data migration task...");
    await migrateData();
    console.log("Data migration task completed.");
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// Keep the process running
console.log("Cron job scheduled to run at 11 PM every day.");
