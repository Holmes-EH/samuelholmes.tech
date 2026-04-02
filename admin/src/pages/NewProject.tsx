// src/pages/ProjectNew.tsx
import { useNavigate } from "@solidjs/router";
import { createForm } from "@tanstack/solid-form";
import { createSignal, For, Show } from "solid-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Switch,
  SwitchControl,
  SwitchInput,
  SwitchLabel,
  SwitchThumb,
} from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldTextArea,
} from "@/components/ui/text-field";
import { ImageUpload } from "@/components/ImageUpload";
import { useGraphQLClient } from "@/lib/graphql";
import { createProjectMutation } from "@/lib/graphql/mutations";
import { toast } from "somoto";
import { useErrorHandler } from "@/lib/errors";

export default function NewProject() {
  const navigate = useNavigate();
  const handleError = useErrorHandler();
  const client = useGraphQLClient();
  const createProject = createProjectMutation(client);

  const form = createForm(() => ({
    defaultValues: {
      title: "",
      description: "",
      techStack: [] as string[],
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      featured: false,
    },
    onSubmit: async ({ value }) => {
      // You'll wire up createMutation here
      try {
        await createProject.mutateAsync(value);
        toast.success("New project created");
        navigate("/projects");
      } catch (error) {
        console.log(error);
        handleError(error, "Failed to Create new project");
      }
    },
    validators: {
      onChange: ({ value }) => {
        if (!value.title) return "Title is required";
        if (!value.description) return "Description is required";
        if (value.techStack.length === 0)
          return "At least one technology is required";
        return undefined;
      },
    },
  }));

  // Tech stack input state (you'll manage this)
  let techInput: HTMLInputElement | undefined;
  const [techStackInput, setTechStackInput] = createSignal("");

  const addTech = () => {
    const tech = techStackInput().trim();
    if (tech) {
      const currentStack = form.getFieldValue("techStack");
      if (!currentStack.includes(tech)) {
        form.setFieldValue("techStack", [...currentStack, tech]);
        setTechStackInput("");
      }
    }
  };

  const removeTech = (tech: string) => {
    const currentStack = form.getFieldValue("techStack");
    form.setFieldValue(
      "techStack",
      currentStack.filter((t) => t !== tech),
    );
  };

  return (
    <div class="mx-auto min-w-2xl">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-slate-100">Create New Project</h1>
        <p class="text-slate-400 mt-1">Add a new project to your portfolio</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Fill in the information about your project
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-6">
            {/* Title Field */}
            <form.Field name="title">
              {(field) => (
                <div class="space-y-2">
                  <TextField
                    name={field().name}
                    value={field().state.value}
                    onChange={field().handleChange}
                    onBlur={() => field().handleBlur()}
                  >
                    <TextFieldLabel for="title">
                      Title <span class="text-red-500">*</span>
                    </TextFieldLabel>
                    <TextFieldInput placeholder="My Awesome Project" />
                    <TextFieldErrorMessage errors={field().state.meta.errors} />
                  </TextField>
                </div>
              )}
            </form.Field>

            {/* Description Field */}
            <form.Field name="description">
              {(field) => (
                <div class="space-y-2">
                  <TextField
                    name={field().name}
                    value={field().state.value}
                    onChange={field().handleChange}
                    onBlur={() => field().handleBlur()}
                  >
                    <TextFieldLabel for="description">
                      Description <span class="text-red-500">*</span>
                    </TextFieldLabel>
                    <TextFieldTextArea rows={4} />
                    <p class="text-sm text-slate-500">
                      {field().state.value.length} characters
                    </p>
                    <TextFieldErrorMessage errors={field().state.meta.errors} />
                  </TextField>
                </div>
              )}
            </form.Field>

            {/* Tech Stack Field */}
            <form.Field name="techStack">
              {(field) => (
                <div class="space-y-2">
                  <TextField>
                    <TextFieldLabel for="techStack">
                      Tech Stack <span class="text-red-500">*</span>
                    </TextFieldLabel>
                    <div class="flex gap-2">
                      <TextFieldInput
                        ref={techInput}
                        id="techStack"
                        placeholder="Add technology (e.g., React, Rust)"
                        value={techStackInput()}
                        onInput={(e) =>
                          setTechStackInput(e.currentTarget.value)
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTech();
                          }
                        }}
                      />
                      <Button type="button" onClick={addTech} variant="outline">
                        Add
                      </Button>
                    </div>
                    <Show when={field().state.value.length > 0}>
                      <div class="flex flex-wrap gap-2 mt-2">
                        <For each={field().state.value}>
                          {(tech) => (
                            <Badge class="pl-3 pr-1">
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeTech(tech)}
                                class="ml-2 hover:text-red-500 transition-colors hover:cursor-pointer"
                              >
                                ✕
                              </button>
                            </Badge>
                          )}
                        </For>
                      </div>
                    </Show>
                  </TextField>
                </div>
              )}
            </form.Field>

            {/* GitHub URL Field */}
            <form.Field name="githubUrl">
              {(field) => (
                <div class="space-y-2">
                  <TextField
                    name={field().name}
                    value={field().state.value}
                    onChange={field().handleChange}
                    onBlur={() => field().handleBlur()}
                  >
                    <TextFieldLabel for="githubUrl">GitHub URL</TextFieldLabel>
                    <TextFieldInput
                      type="url"
                      placeholder="https://github.com/username/repo"
                    />
                    <TextFieldErrorMessage errors={field().state.meta.errors} />
                  </TextField>
                </div>
              )}
            </form.Field>

            {/* Live URL Field */}
            <form.Field name="liveUrl">
              {(field) => (
                <div class="space-y-2">
                  <TextField
                    name={field().name}
                    value={field().state.value}
                    onChange={field().handleChange}
                    onBlur={() => field().handleBlur()}
                  >
                    <TextFieldLabel for="liveUrl">Live URL</TextFieldLabel>
                    <TextFieldInput
                      id="liveUrl"
                      type="url"
                      placeholder="https://example.com"
                    />
                    <TextFieldErrorMessage errors={field().state.meta.errors} />
                  </TextField>
                </div>
              )}
            </form.Field>

            {/* Image URL Field */}
            <form.Field name="imageUrl">
              {(field) => (
                <TextField
                  validationState={
                    field().state.meta.isTouched && !field().state.meta.isValid
                      ? "invalid"
                      : "valid"
                  }
                >
                  <ImageUpload
                    value={field().state.value}
                    onChange={(url) => field().handleChange(url)}
                  />
                </TextField>
              )}
            </form.Field>

            {/* Featured Toggle */}
            <form.Field name="featured">
              {(field) => (
                <div class="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                  <div class="space-y-0.5">
                    <TextField
                      validationState={
                        field().state.meta.isTouched &&
                        !field().state.meta.isValid
                          ? "invalid"
                          : "valid"
                      }
                    >
                      <Switch
                        class="flex items-center gap-x-2 self-start"
                        name={field().name}
                        checked={field().state.value}
                        onChange={field().handleChange}
                      >
                        <SwitchInput />
                        <SwitchControl>
                          <SwitchThumb />
                        </SwitchControl>
                        <SwitchLabel>
                          Featured Project
                          <p class="text-sm text-slate-400">
                            Show this project prominently on your portfolio
                          </p>
                        </SwitchLabel>
                      </Switch>
                    </TextField>
                  </div>
                </div>
              )}
            </form.Field>
          </CardContent>

          <CardFooter class="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/projects")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={false /* form.state.isSubmitting */}
            >
              <Show
                when={false /* form.state.isSubmitting */}
                fallback="Create Project"
              >
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </Show>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
