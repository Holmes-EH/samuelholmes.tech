// src/pages/Dashboard.tsx
import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/solid-query";
import { useGraphQLClient } from "@/lib/graphql";
import { ListProjectsQuery } from "@/generated/graphql";
import { GraphQLClient } from "graphql-request";
import Stats from "@/components/dashboard/Stats";
import { LIST_PROJECTS } from "@/lib/gql";

const projectsQuery = (client: GraphQLClient) =>
  useQuery(() => ({
    queryKey: ["listProjects"],
    queryFn: async () => {
      const projects = await client.request<ListProjectsQuery>(LIST_PROJECTS);
      return projects;
    },
  }));

export default function Dashboard() {
  const { user } = useAuth();
  const client = useGraphQLClient();

  const projects = projectsQuery(client);

  const quickActions = [
    {
      title: "New Project",
      description: "Add a new project to your portfolio",
      icon: "➕",
      href: "/projects/new",
    },
    {
      title: "View All Projects",
      description: "Manage your existing projects",
      icon: "📋",
      href: "/projects",
    },
  ];

  return (
    <div class="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 class="text-3xl font-bold text-slate-100 mb-2">
          Welcome back,{" "}
          <span class="text-primary">{user()?.name || "Admin"}</span>
        </h1>
        <p class="text-slate-400">
          Here's what's happening with your portfolio
        </p>
      </div>

      {/* Stats Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Show when={projects.status === "pending"}>Loading ...</Show>
        <Show when={projects.status === "error"}>Error ...</Show>
        <Show when={projects.data}>
          {(data) => <Stats projects={data()} />}
        </Show>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={quickActions}>
            {(action) => (
              <A
                href={action.href}
                class="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-primary rounded-lg transition-all group"
              >
                <div class="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                  <span class="text-2xl">{action.icon}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-100 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p class="text-sm text-slate-400">{action.description}</p>
                </div>
              </A>
            )}
          </For>
        </CardContent>
      </Card>
    </div>
  );
}
