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
      title
      description
      techStack
      githubUrl
      liveUrl
      imageUrl
      featured
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($newProject: CreateProjectInput!) {
    createProject(newProject: $newProject) {
      id
      title
      description
      techStack
      githubUrl
      liveUrl
      imageUrl
      featured
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: String!) {
    getProject(projectId: $id) {
      id
      title
      description
      techStack
      githubUrl
      liveUrl
      imageUrl
      featured
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
      id
      title
      description
      techStack
      githubUrl
      liveUrl
      imageUrl
      featured
      createdAt
      updatedAt
    }
  }
`;
