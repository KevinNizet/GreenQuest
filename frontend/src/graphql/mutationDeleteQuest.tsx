import { gql } from "@apollo/client";

export const mutationDeleteQuest = gql`
  mutation Mutation($deleteQuestId: ID!) {
    deleteQuest(id: $deleteQuestId) {
      id
    }
  }
`;
