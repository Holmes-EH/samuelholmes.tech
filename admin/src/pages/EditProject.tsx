import { useNavigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useGraphQLClient } from "@/lib/graphql";
import { getProjectQuery } from "@/lib/graphql/queries";
import { updateProjectMutation } from "@/lib/graphql/mutations";
import { useToast } from "@/contexts/ToastContext";
import { useErrorHandler } from "@/lib/errors";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ProjectForm,
  ProjectFormData,
} from "@/components/projects/ProjectForm";

export default function EditProject() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const client = useGraphQLClient();
  const toast = useToast();
  const handleError = useErrorHandler();

  const projectQuery = getProjectQuery(client, params);

  const updateMutation = updateProjectMutation(client);

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      await updateMutation.mutateAsync({ id: params.id, ...data });
      toast.success("Project updated successfully!");
      navigate("/projects");
    } catch (error) {
      handleError(error, "Failed to update project");
    }
  };

  return (
    <div class="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-100">Edit Project</h1>
        <p class="text-slate-400 mt-1">Update your project details</p>
      </div>

      <Show
        when={!projectQuery.isLoading && projectQuery.data}
        fallback={
          <Card>
            <CardContent class="space-y-4 pt-6">
              <Skeleton class="h-10 w-full" />
              <Skeleton class="h-32 w-full" />
              <Skeleton class="h-10 w-full" />
            </CardContent>
          </Card>
        }
      >
        {(project) => (
          <ProjectForm
            initialValues={project()}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/projects")}
            submitLabel="Update Project"
            isSubmitting={updateMutation.isPending}
          />
        )}
      </Show>
    </div>
  );
}
