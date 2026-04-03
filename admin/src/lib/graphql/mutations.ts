import { useMutation } from "@tanstack/solid-query";
import { GraphQLClient } from "graphql-request";
import { CREATE_PROJECT, LOGIN_USER, UPDATE_PROJECT } from "./gql";
import {
  CreateProjectInput,
  CreateProjectMutation,
  LoginResponse,
  MutationRootLoginUserArgs,
  UpdateProjectInput,
} from "@/generated/graphql";

export const loginMutation = (client: GraphQLClient) =>
  useMutation(() => ({
    mutationFn: async (input: MutationRootLoginUserArgs) => {
      const data = await client.request<{ loginUser: LoginResponse }>(
        LOGIN_USER,
        {
          email: input.email,
          password: input.password,
        },
      );
      return data.loginUser;
    },
  }));

export const createProjectMutation = (client: GraphQLClient) =>
  useMutation(() => ({
    mutationFn: async (input: CreateProjectInput) => {
      const data = await client.request<CreateProjectMutation>(CREATE_PROJECT, {
        newProject: input,
      });
      return data;
    },
  }));

export const updateProjectMutation = (client: GraphQLClient) =>
  useMutation(() => ({
    mutationFn: async (input: UpdateProjectInput) => {
      const data = await client.request(UPDATE_PROJECT, {
        project: input,
      });
      return data;
    },
  }));
