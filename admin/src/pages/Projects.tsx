import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGraphQLClient } from "@/lib/graphql";
import { projectsQuery } from "@/lib/graphql/queries";
import { A } from "@solidjs/router";
import SquarePlus from "lucide-solid/icons/square-plus";
import { createSignal, For, Show } from "solid-js";

export default function Projects() {
  const [filter, setFilter] = createSignal("");

  const client = useGraphQLClient();
  const projects = projectsQuery(client);

  // TODO: implement filtering logic

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-secondary-foreground">Projects</h1>
          <p class="text-slate-400 mt-1">Manage your portfolio projects</p>
        </div>
        <Button as={A} href="/projects/new">
          <SquarePlus />
          New Project
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search projects..."
                  class="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <Select
              options={["all", "featured", "regular"]}
              placeholder="Filter by status"
              value={filter()}
              onChange={setFilter}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="w-[180px]" aria-label="Fruit">
                <SelectValue<string>>
                  {(state) => state.selectedOption()}
                </SelectValue>
              </SelectTrigger>
              <SelectPortal>
                <SelectContent />
              </SelectPortal>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <Show when={projects.data?.listProjects.length}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <For each={projects.data?.listProjects}>
            {(project) => <ProjectCard project={project} />}
          </For>
        </div>
      </Show>

      {/* Loading State */}
      <Show when={projects.status === "pending"}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          <For each={[1, 2, 3]}>
            {() => (
              <Card class="min-w-2xs">
                <CardHeader>
                  <Skeleton height={16} width={230} />
                </CardHeader>
                <CardContent>
                  <div class="flex gap-2 mb-4">
                    <Skeleton radius={69} height={50} width={50} />
                    <Skeleton height={50} width={100} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton height={20} width={100} />
                </CardFooter>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
