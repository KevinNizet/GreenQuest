import { gql } from "@apollo/client";

export const queryGetUserMission = gql`
  query GetUserMissions($userId: ID!) {
    item: getUserMissions(userId: $userId) {
      isCompleted
      id
      mission {
        id
        title
        XPValue
      }
    }
  }
`;
