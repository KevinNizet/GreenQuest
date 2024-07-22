import { UserMission } from "./entities/UserMission";
import cron from "node-cron";

async function resetMissions() {
  try {
    await UserMission.update({ isCompleted: true }, { isCompleted: false });
    console.log("Missions have been reset to not completed!");
    const now = new Date();
    const midnight = new Date(now.setHours(0, 0, 0, 0));
    // Màj de l'indicateur de réinitialisation en BDD dans UserMission
    await UserMission.update({}, { resetDate: midnight });
  } catch (err) {
    console.error("Error resetting missions:", err);
  }
}

// Vérifie si les missions ont été réinitialisées aujourd'hui (minuit)
async function checkAndResetMissions() {
  try {
    const now = new Date();
    const midnight = new Date(now.setHours(0, 0, 0, 0));

    // Vérifie si la mission a été réinitialisée aujourd'hui (à minuit)
    const missions = await UserMission.find({ where: { resetDate: midnight } });

    if (missions.length === 0) {
      // Si pas de réinitialisation trouvée, réinitialisation maintenant via resetMissions()
      await resetMissions();
    }
  } catch (err) {
    console.error("Error checking and resetting missions:", err);
  }
}

// Planification du cron - éxécution tous les jours à minuit
cron.schedule("0 0 * * *", async () => {
  try {
    await checkAndResetMissions();
  } catch (err) {
    console.error("error reset mission", err);
  }
});

// Planification du deuxième cron - éxécution toutes les minutes
cron.schedule("* * * * *", async () => {
  try {
    await checkAndResetMissions();
  } catch (err) {
    console.error("Error checking and resetting missions every minute", err);
  }
});
