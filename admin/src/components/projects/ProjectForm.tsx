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

export interface ProjectFormData {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  featured: boolean;
}

interface ProjectFormProps {
  initialValues?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function ProjectForm(props: ProjectFormProps) {
  let techInput: HTMLInputElement | undefined;
  const [techStackInput, setTechStackInput] = createSignal("");

  const form = createForm(() => ({
    defaultValues: {
      title: props.initialValues?.title ?? "",
      description: props.initialValues?.description ?? "",
      techStack: props.initialValues?.techStack ?? [],
      githubUrl: props.initialValues?.githubUrl ?? "",
      liveUrl: props.initialValues?.liveUrl ?? "",
      imageUrl: props.initialValues?.imageUrl ?? "",
      featured: props.initialValues?.featured ?? false,
    },
    onSubmit: async ({ value }) => {
      await props.onSubmit(value as ProjectFormData);
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

  const addTech = () => {
    const tech = techStackInput().trim();
    if (tech) {
      const currentStack = form.getFieldValue("techStack");
      if (!currentStack.includes(tech)) {
        form.setFieldValue("techStack", [...currentStack, tech]);
        setTechStackInput("");
        techInput?.focus();
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      class="w-full max-w-5xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill in the information about your project
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          {/* Row 1: Title (full width) */}
          <form.Field name="title">
            {(field) => (
              <TextField
                name={field().name}
                value={field().state.value}
                onChange={field().handleChange}
                onBlur={() => field().handleBlur()}
              >
                <TextFieldLabel for="title">
                  Title <span class="text-red-500">*</span>
                </TextFieldLabel>
                <TextFieldInput id="title" placeholder="My Awesome Project" />
                <TextFieldErrorMessage errors={field().state.meta.errors} />
              </TextField>
            )}
          </form.Field>

          {/* Row 2: Description (full width) */}
          <form.Field name="description">
            {(field) => (
              <TextField
                name={field().name}
                value={field().state.value}
                onChange={field().handleChange}
                onBlur={() => field().handleBlur()}
              >
                <TextFieldLabel for="description">
                  Description <span class="text-red-500">*</span>
                </TextFieldLabel>
                <TextFieldTextArea id="description" rows={5} />
                <p class="text-sm text-slate-500">
                  {field().state.value.length} characters
                </p>
                <TextFieldErrorMessage errors={field().state.meta.errors} />
              </TextField>
            )}
          </form.Field>

          {/* Row 3: Tech Stack (full width) */}
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
                      onInput={(e) => setTechStackInput(e.currentTarget.value)}
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
                </TextField>
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
              </div>
            )}
          </form.Field>

          {/* Row 4: GitHub + Live URL side by side */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field name="githubUrl">
              {(field) => (
                <TextField
                  name={field().name}
                  value={field().state.value}
                  onChange={field().handleChange}
                  onBlur={() => field().handleBlur()}
                >
                  <TextFieldLabel for="githubUrl">GitHub URL</TextFieldLabel>
                  <TextFieldInput
                    id="githubUrl"
                    type="url"
                    placeholder="https://github.com/username/repo"
                  />
                  <TextFieldErrorMessage errors={field().state.meta.errors} />
                </TextField>
              )}
            </form.Field>

            <form.Field name="liveUrl">
              {(field) => (
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
              )}
            </form.Field>
          </div>

          {/* Row 5: Image upload + Featured toggle side by side */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
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

            <form.Field name="featured">
              {(field) => (
                <div class="flex items-start p-4 border border-slate-700 rounded-lg h-full">
                  <TextField
                    validationState={
                      field().state.meta.isTouched &&
                      !field().state.meta.isValid
                        ? "invalid"
                        : "valid"
                    }
                  >
                    <Switch
                      class="flex items-center gap-x-2"
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
              )}
            </form.Field>
          </div>
        </CardContent>

        <CardFooter class="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={props.isSubmitting ?? false}>
            <Show
              when={props.isSubmitting}
              fallback={props.submitLabel ?? "Save"}
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
              Saving...
            </Show>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
