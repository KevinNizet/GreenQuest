import { gql } from "@apollo/client";

export const queryUser = gql`
  query user($userId: ID!) {
    user(id: $userId) {
      id
      firstname
      lastname
      nickname
      email
    }
  }
`;
