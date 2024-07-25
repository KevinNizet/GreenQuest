import { UserMission } from "./entities/UserMission";
import { Not } from "typeorm";
import cron from "node-cron";

// TODO: Améliorer le Cron

async function resetMissions() {
  try {
    // Réinitialisation de toutes les missions marquées "validées"
    await UserMission.update({ isCompleted: true }, { isCompleted: false });
    console.log("Missions have been reset to not completed!");

    // Récupére la date actuelle et la modifie pour représenter minuit de ce jour
    // const now = new Date();
    // const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Màj la date de réinitialisation pour toutes les missions
    // await UserMission.update({}, { resetDate: midnight });
  } catch (err) {
    console.error("Error resetting missions:", err);
  }
}

// Vérifie si les missions ont été réinitialisées aujourd'hui (minuit)
// async function checkAndResetMissions() {
//   try {
//     const now = new Date();
//     const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     // Vérifie si la mission a été réinitialisée aujourd'hui (à minuit)
//     const missions = await UserMission.find({
//       where: {
//         resetDate: Not(midnight), // Missions dont la date de réinitialisation n'est pas minuit d'aujourd'hui
//         isCompleted: false, // Missions qui ne sont pas complètes
//       },
//     });

//     if (missions.length === 0) {
//       // Si pas de réinitialisation trouvée, réinitialisation maintenant via resetMissions()
//       await resetMissions();
//     }
//   } catch (err) {
//     console.error("Error checking and resetting missions:", err);
//   }
// }

// Planification du cron - éxécution tous les jours à minuit
cron.schedule("0 0 * * *", async () => {
  try {
    await resetMissions();
  } catch (err) {
    console.error("error reset mission", err);
  }
});

// Planification du deuxième cron - éxécution toutes les minutes
// cron.schedule("* * * * *", async () => {
//   try {
//     await checkAndResetMissions();
//   } catch (err) {
//     console.error("Error checking and resetting missions every minute", err);
//   }
// });
