import { gql } from "@apollo/client";

export const mutationValidateMission = gql`
  mutation Mutation($missionId: ID!, $userId: ID!) {
    validateMission(missionId: $missionId, userId: $userId) {
      points
    }
  }
`;
