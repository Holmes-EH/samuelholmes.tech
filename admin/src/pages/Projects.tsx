import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
          <h1 class="text-3xl font-bold text-slate-100">Projects</h1>
          <p class="text-slate-400 mt-1">Manage your portfolio projects</p>
        </div>
        <Button as={A} href="/projects/new">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
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
            {(project) => (
              <Card class="group hover:border-primary transition-colors min-w-2xs flex flex-col justify-between">
                <CardHeader>
                  <div class="flex items-start justify-between mb-2">
                    <CardTitle class="group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <Show when={project.featured}>
                      <Badge
                        variant="secondary"
                        class="bg-accent/20 text-accent-bright"
                      >
                        ⭐ Featured
                      </Badge>
                    </Show>
                  </div>
                  <CardDescription class="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Tech Stack Tags */}
                  <div class="flex flex-wrap gap-2 mb-4">
                    <For each={project.techStack.slice(0, 3)}>
                      {(tech) => <Badge class="text-xs">{tech}</Badge>}
                    </For>
                    <Show when={project.techStack.length > 3}>
                      <Badge class="text-xs">
                        +{project.techStack.length - 3}
                      </Badge>
                    </Show>
                  </div>

                  {/* Links */}
                  <div class="flex gap-2 text-sm text-slate-400">
                    <Show when={project.liveUrl}>
                      <A
                        href={project.liveUrl ?? ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-1 hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                        Live
                      </A>
                    </Show>
                    <Show when={project.githubUrl}>
                      <a
                        href={project.githubUrl ?? ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-1 hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    </Show>
                  </div>
                </CardContent>

                <CardFooter class="flex gap-2">
                  <Button
                    as={A}
                    href={`/projects/${project.id}/edit`}
                    variant="outline"
                    size="sm"
                    class="flex-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      // TODO: wire up delete confirmation
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </Button>
                </CardFooter>
              </Card>
            )}
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
