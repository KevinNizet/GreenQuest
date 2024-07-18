import { gql } from "@apollo/client";

export const queryGetTotalPointsForQuest = gql`
  query Query($questId: ID!, $userIds: [ID!]!) {
    item: getTotalPointsForQuest(questId: $questId, userIds: $userIds) {
      points
      userId
    }
  }
`;
