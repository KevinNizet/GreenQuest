import { gql } from "@apollo/client";

export const mutationValidateMission = gql`
  mutation Mutation($missionId: ID!, $userId: ID!, $questId: ID!) {
    validateMission(missionId: $missionId, userId: $userId, questId: $questId) {
      points
    }
  }
`;
