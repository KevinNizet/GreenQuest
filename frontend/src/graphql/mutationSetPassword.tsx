import { gql } from "@apollo/client";

export const mutationSetPassword = gql`
  mutation SetPassword($token: String!, $password: String!) {
    setPassword(token: $token, password: $password)
  }
`;
