import { gql } from "@apollo/client";

export const mutationAccountValidation = gql`
  mutation validateAccount($token: String!) {
    validateAccount(token: $token)
  }
`;
