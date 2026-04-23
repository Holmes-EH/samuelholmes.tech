import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { A } from "@solidjs/router";
import SquareArrowOutUpRight from "lucide-solid/icons/square-arrow-out-up-right";
import Star from "lucide-solid/icons/star";
import { For, Show } from "solid-js";
import { Button } from "../ui/button";
import Pencil from "lucide-solid/icons/pencil";
import Trash from "lucide-solid/icons/trash";
import { Project } from "@/generated/graphql";

export function ProjectCard(props: { project: Project }) {
  const project = props.project;
  console.log(project);
  return (
    <Card class="group hover:border-primary transition-colors min-w-2xs flex flex-col justify-between">
      <CardHeader>
        <div class="flex items-start justify-between mb-2">
          <CardTitle class="group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
          <Show when={project.featured}>
            <Badge variant="secondary" class="bg-accent/20 text-accent-bright">
              <Star class="fill-primary stroke-primary" /> Featured
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
          <For each={project.techStack?.slice(0, 3)}>
            {(tech) => <Badge class="text-xs">{tech}</Badge>}
          </For>
          <Show when={project.techStack?.length > 3}>
            <Badge class="text-xs">+{project.techStack.length - 3}</Badge>
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
              <SquareArrowOutUpRight size={18} />
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
              <SquareArrowOutUpRight size={18} />
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
          <Pencil />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            // TODO: wire up delete confirmation
          }}
        >
          <Trash />
        </Button>
      </CardFooter>
    </Card>
  );
}
