import { ListProjectsQuery } from "@/generated/graphql";
import { useQuery } from "@tanstack/solid-query";
import { GraphQLClient } from "graphql-request";
import { GET_PROJECT, LIST_PROJECTS } from "./gql";

export const projectsQuery = (client: GraphQLClient) =>
  useQuery(() => ({
    queryKey: ["listProjects"],
    queryFn: async () => {
      const projects = await client.request<ListProjectsQuery>(LIST_PROJECTS);
      return projects;
    },
  }));

export const getProjectQuery = (
  client: GraphQLClient,
  params: { id: string },
) =>
  useQuery(() => ({
    queryKey: ["project", params.id],
    queryFn: async () => {
      const data = await client.request(GET_PROJECT, { id: params.id });
      return data.getProject;
    },
  }));
