import { Arg, ID, Query, Resolver } from "type-graphql";
import { Image } from "../entities/Image";

@Resolver(Image)
export class ImageResolver {
  @Query(() => [Image])
  async allImages(): Promise<Image[]> {
    const images = await Image.find({});
    return images;
  }

  @Query(() => Image, { nullable: true })
  async image(@Arg("id", () => ID) id: number): Promise<Image | null> {
    const image = await Image.findOneBy({ id });
    if (!image) {
      throw new Error("Image non trouvée");
    }
    return image;
  }
}
