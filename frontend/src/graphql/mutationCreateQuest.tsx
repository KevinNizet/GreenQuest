import { gql } from "@apollo/client";

export const mutationCreateQuest = gql`
  mutation Mutation($data: QuestCreateInput!) {
    createQuest(data: $data) {
      id
      title
      description
      startDate
      duration
      missions {
        id
      }
      code
      users {
        id
      }
    }
  }
`;
