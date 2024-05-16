import { gql } from "@apollo/client";

export const queryGetQuestById = gql`
  query Query($getQuestByIdId: ID!) {
    getQuestById(id: $getQuestByIdId) {
      id
      code
    }
  }
`;
