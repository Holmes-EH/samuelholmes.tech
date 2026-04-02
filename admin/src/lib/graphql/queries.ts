import { ListProjectsQuery } from "@/generated/graphql";
import { useQuery } from "@tanstack/solid-query";
import { GraphQLClient } from "graphql-request";
import { LIST_PROJECTS } from "./gql";

export const projectsQuery = (client: GraphQLClient) =>
  useQuery(() => ({
    queryKey: ["listProjects"],
    queryFn: async () => {
      const projects = await client.request<ListProjectsQuery>(LIST_PROJECTS);
      return projects;
    },
  }));
