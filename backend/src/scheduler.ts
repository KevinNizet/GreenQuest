import { UserMission } from "./entities/UserMission";
import cron from "node-cron";

async function resetMissions() {
  await UserMission.update({ isCompleted: true }, { isCompleted: false });
  console.log("Missions has been reset to be completed !");
}
cron.schedule("*/2 * * * *", async () => {
  try {
    await resetMissions();
  } catch (err) {
    console.error("error reset mission", err);
  }
});
