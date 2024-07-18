import { UserMission } from "./entities/UserMission";
import cron from "node-cron";

async function resetMissions() {
  try {
    await UserMission.update({ isCompleted: true }, { isCompleted: false });
    console.log("Missions have been reset to not completed!");
  } catch (err) {
    console.error("Error resetting missions:", err);
  }
}

cron.schedule("0 0 * * *", async () => {
  try {
    await resetMissions();
  } catch (err) {
    console.error("error reset mission", err);
  }
});
