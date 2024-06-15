import multer from "multer";
import { Express, Request, Response } from "express";
import { Image } from "./entities/Image";
import { User } from "./entities/User";
import { getUserFromReq } from "./auth";

export function initializeRoutes(app: Express) {
  const upload = multer({ dest: "/app/uploads/" });

  // Route pour uploader une image
  app.post(
    "/api/users/:userId/image",
    upload.single("file"),
    async (req: Request, res: Response) => {
      const connectedUser = await getUserFromReq(req, res);

      if (!connectedUser) {
        return res
          .status(401)
          .json({ success: false, message: "Utilisateur non authentifié" });
      }

      const { userId } = req.params;
      const user = await User.findOne({ where: { id: parseInt(userId, 10) } });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
      }

      if (req.file) {
        const newImage = new Image();
        newImage.mimetype = req.file.mimetype;
        newImage.path = req.file.path;
        newImage.originalName = req.file.originalname;
        await newImage.save();

        user.image = newImage;
        await user.save();

        res.json({ success: true, image: newImage });
      } else {
        res.json({ success: false, message: "Fichier non fourni" });
      }
    }
  );

  // Route pour lire une image
  app.get("/api/images/:imageId", async (req: Request, res: Response) => {
    const connectedUser = await getUserFromReq(req, res);

    if (!connectedUser) {
      return res
        .status(401)
        .json({ success: false, message: "Utilisateur non authentifié" });
    }
    const imageId = Number(req.params.imageId);
    const image = await Image.findOneBy({ id: imageId });
    if (image) {
      res.sendFile(image.path);
    } else {
      res.status(404).json({ success: false, message: "Fichier non trouvé" });
    }
  });
}
