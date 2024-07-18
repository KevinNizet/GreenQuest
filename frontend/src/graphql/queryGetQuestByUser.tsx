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
      createdBy {
        id
      }
      startDate
      title
      users {
        id
        nickname
        userMissions {
          isCompleted
          id
        }
      }
      missions {
        id
        title
      }
    }
  }
`;
