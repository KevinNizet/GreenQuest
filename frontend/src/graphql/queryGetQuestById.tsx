import { gql } from "@apollo/client";

export const queryGetQuestById = gql`
  query GetQuestById($getQuestByIdId: ID!) {
    item: getQuestById(id: $getQuestByIdId) {
      users {
        id
        nickname
      }
      id
      title
      code
    }
  }
`;
