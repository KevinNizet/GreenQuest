import { gql } from "@apollo/client";

export const mutationResetPassword = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;
