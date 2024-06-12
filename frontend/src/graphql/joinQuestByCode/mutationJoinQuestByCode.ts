import { gql } from "@apollo/client";

export const mutationJoinQuestByCode = gql`
  mutation JoinQuestByCode($code: Float!) {
    joinQuestByCode(code: $code) {
      code
    }
  }
`;
