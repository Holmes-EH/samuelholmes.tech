import type { Project } from "../generated/graphql";

const GRAPHQL_URL =
  import.meta.env.PUBLIC_API_URL || "http://localhost:8000/graphql";

export async function graphqlQuery<T>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(`GraphQL Error: ${errors[0].message}`);
  }

  return data;
}

export async function listProjects(): Promise<Project[]> {
  const data = await graphqlQuery<{ listProjects: Project[] }>(`
    query {
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
  `);

  return data.listProjects;
}

export async function getProject(id: string): Promise<Project | null> {
  const data = await graphqlQuery<{ getProject: Project | null }>(
    `
    query GetProject($id: String!) {
      getProject(id: $id) {
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
  `,
    { id },
  );

  return data.getProject;
}
