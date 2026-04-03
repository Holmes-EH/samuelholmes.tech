import { useNavigate } from "@solidjs/router";
import { useGraphQLClient } from "@/lib/graphql";
import { createProjectMutation } from "@/lib/graphql/mutations";
import { toast } from "somoto";
import { useErrorHandler } from "@/lib/errors";
import {
  ProjectForm,
  ProjectFormData,
} from "@/components/projects/ProjectForm";

export default function NewProject() {
  const navigate = useNavigate();
  const handleError = useErrorHandler();
  const client = useGraphQLClient();
  const createProject = createProjectMutation(client);

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      await createProject.mutateAsync(data);
      toast.success("New project created");
      navigate("/projects");
    } catch (error) {
      console.log(error);
      handleError(error, "Failed to Create new project");
    }
  };

  return (
    <div class="mx-auto min-w-2xl">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-slate-100">Create New Project</h1>
        <p class="text-slate-400 mt-1">Add a new project to your portfolio</p>
      </div>
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/projects")}
        submitLabel="Create Project"
        isSubmitting={createProject.isPending}
      />
    </div>
  );
}
