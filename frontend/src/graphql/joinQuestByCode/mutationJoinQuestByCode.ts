import { gql } from "@apollo/client";

export const mutationJoinQuestByCode = gql`
  mutation JoinQuestByCode($code: Int!) {
    joinQuestByCode(code: $code) {
      code
    }
  }
`;
