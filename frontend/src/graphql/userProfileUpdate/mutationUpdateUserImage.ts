import { gql } from "@apollo/client";

export const mutationUpdateUserImage = gql`
  mutation UpdateUserImage($image: ObjectID!) {
    updateUserImage(image: $image) {
      id
      nickname
      image {
        id
        mimetype
        uri
      }
    }
  }
`;
