import Mailjet from "node-mailjet";

// Mailjet configuration
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

// Function to send the reset password email
export async function sendResetPassword(email: string, token: string) {
  const frontUrl = process.env.FRONT_URL;

  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "greenquest034@gmail.com",
            Name: "Equipe GreenQuest",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Réinitialisation de ton mot de passe",
          TextPart: `Clique sur le lien dans le mail pour réinitialiser ton mot de passe - ${token}`,
          HTMLPart: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #006400;">Réinitialisation de ton mot de passe</h2>
            <p>Bonjour,</p>
            <p>Tu as fait une demande de réinitialisation de mot de passe. Clique sur le lien ci-dessous pour réinitialiser ton mot de passe :</p>
            <p style="text-align: center;">
              <a href="${frontUrl}/setNewPassword?token=${token}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #006400; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
            </p>
            <p>Si tu n'as pas fait cette demande, ignore ce message.</p>
            <p>Cordialement,<br>L'équipe GreenQuest</p>
            <p style="font-size: 12px; color: #888;">Si le bouton ne fonctionne pas, copie et colle le lien suivant dans ton navigateur : ${frontUrl}/setNewPassword?token=${token}</p>
          </div>
        `,
        },
      ],
    });

    console.log(result.body);
  } catch (err: any) {
    console.log(err.statusCode);
  }
}
