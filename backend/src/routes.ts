import multer from "multer";
import { Express, Request, Response } from "express";
import { Image } from "./entities/Image";
import { User } from "./entities/User";

export function initializeRoutes(app: Express) {
  const upload = multer({ dest: "/app/uploads/" });

  app.post(
    "/api/users/:userId/image",
    upload.single("file"),
    async (req: Request, res: Response) => {
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
}
