import { gql } from "@apollo/client";

export const queryGetUsers = gql`
  query GetUsers {
    item: getUsers {
      id
      nickname
      userMissions {
        points
      }
      questsParticipated {
        title
        id
      }
    }
  }
`;
