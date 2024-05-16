import { gql } from "@apollo/client";

export const queryGetQuestByUser = gql`
  query GetQuestByUser($userId: ID!) {
    item: getQuestByUser(userId: $userId) {
      code
      createdAt
      description
      difficulty
      duration
      id
      startDate
      title
      users {
        id
        nickname
      }
    }
  }
`;
