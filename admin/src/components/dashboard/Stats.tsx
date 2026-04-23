import { Component, For } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ListProjectsQuery } from "@/generated/graphql";

type MyProps = {
  projects: ListProjectsQuery;
};

export type Stat = {
  title: string;
  value: number;
  description: string;
  icon: string;
};

const buildStatsFromProjectList = (projectsList: ListProjectsQuery): Stat[] => {
  const projects = projectsList.listProjects;
  const stats: Stat[] = [];
  stats.push({
    title: "Total Projects",
    value: projects.length,
    description: "All time",
    icon: "📁",
  });

  const featuredCount = projects.filter((p) => p.featured).length;
  stats.push({
    title: "Featured",
    value: featuredCount,
    description: "Currently showcased",
    icon: "⭐",
  });

  const lastUpdatedProject = projects.reduce((latest, project) =>
    new Date(project.updatedAt) > new Date(latest.updatedAt) ? project : latest,
  );

  if (lastUpdatedProject !== undefined) {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(lastUpdatedProject.updatedAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    stats.push({
      title: "Last Update",
      value: daysSinceUpdate,
      description: "Days ago",
      icon: "🕐",
    });
  }

  return stats;
};

const Stats: Component<MyProps> = (props) => {
  const stats = buildStatsFromProjectList(props.projects);
  return (
    <For each={stats}>
      {(stat) => (
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium text-slate-400">
              {stat.title}
            </CardTitle>
            <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span class="text-2xl">{stat.icon}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-secondary-foreground">
              {stat.value}
            </div>
            <p class="text-xs text-slate-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      )}
    </For>
  );
};

export default Stats;
