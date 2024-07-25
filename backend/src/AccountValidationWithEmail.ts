import Mailjet from "node-mailjet";

// Mailjet configuration
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

export async function sendValidationEmail(email: string, token: string) {
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
          Subject: "Validation du compte",
          TextPart: `Clique sur le lien dans le mail pour valider la création de ton compte - ${token}`,
          HTMLPart: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #006400;">Validation de ton compte</h2>
            <p>Bonjour,</p>
            <p>Merci de t'être inscrit sur notre plateforme ! Clique sur le lien ci-dessous pour valider ton compte :</p>
            <p style="text-align: center;">
              <a href="${frontUrl}/accountValidation?token=${token}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #006400; text-decoration: none; border-radius: 5px;">Valider mon compte</a>
            </p>
            <p>Si tu n'as pas fait cette demande, ignore ce message.</p>
            <p>Cordialement,<br>L'équipe GreenQuest</p>
            <p style="font-size: 12px; color: #888;">Si le bouton ne fonctionne pas, copie et colle le lien suivant dans ton navigateur : ${frontUrl}/accountValidation?token=${token}</p>
          </div>
        `,
        },
      ],
    });

    console.log("mailjet email sent:", result.body);
  } catch (err: any) {
    console.log("mailjet error:", err.statusCode);
  }
}
