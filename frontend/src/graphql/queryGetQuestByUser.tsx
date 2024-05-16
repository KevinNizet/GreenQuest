import { gql } from "@apollo/client";

export const queryGetQuestByUser = gql`
  query Query($getQuestByIdId: ID!) {
    item: getQuestById(id: $getQuestByIdId) {
      users {
        id
      }
      code
      createdAt
      description
      difficulty
      duration
      id
      missions {
        XPValue
        createdAt
        byDefault
        description
        difficulty
        id
        title
      }
    }
  }
`;
