import multer from "multer";
import express, { Express, Request, Response } from "express";
import { Image } from "./entities/Image";
import { User } from "./entities/User";
import { getUserFromReq } from "./auth";
import sharp from "sharp";
import cors from "cors";
import path from "path";

export function initializeRoutes(app: Express) {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  const allowedOrigins = [
    "http://localhost:3000",
    "https://staging.0923-rouge-3.wns.wilders.dev",
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  // Route pour uploader une image
  app.post(
    "/users/:userId/image",
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

      if (req.file && req.file.mimetype.startsWith("image/")) {
        // Récupération de l'extention de l'image grâce à mime
        const extension = req.file.originalname.split(".").pop();
        const filename = `${Date.now()}-${
          Math.random() * 8999 + 1000
        }.${extension}`;

        // Redimensionnement du fichier avec sharp
        await sharp(req.file.buffer)
          .resize({
            width: 2000,
            height: 2000,
            fit: "inside",
            withoutEnlargement: true,
          })
          .toFile(`/app/backend/public/uploads/${filename}`);

        // Enregistrement de l'image
        const newImage = new Image();
        newImage.mimetype = req.file.mimetype;
        newImage.path = `/app/backend/public/uploads/${filename}`;
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
  app.get("/images/:imageId", async (req: Request, res: Response) => {
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
