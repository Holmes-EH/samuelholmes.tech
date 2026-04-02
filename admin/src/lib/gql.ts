import { gql } from "graphql-request";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const LIST_PROJECTS = gql`
  query ListProjects {
    listProjects {
      id
      featured
      createdAt
      updatedAt
    }
  }
`;
