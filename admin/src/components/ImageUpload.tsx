import { createSignal, Show } from "solid-js";
import { Button } from "@/components/ui/button";
import { TextFieldLabel } from "./ui/text-field";
import { useAuth } from "@/contexts/AuthContext";
import { BACKEND_URL } from "@/lib/graphql";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload(props: ImageUploadProps) {
  const [uploading, setUploading] = createSignal(false);
  const [error, setError] = createSignal("");
  const { token } = useAuth();

  const handleUpload = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large (max 5MB)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token()}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      props.onChange(`${BACKEND_URL}${data.url}`); // Or your domain
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div class="space-y-2">
      <TextFieldLabel>Project Image</TextFieldLabel>

      <div class="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={uploading()}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          {uploading() ? "Uploading..." : "Upload Image"}
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          class="hidden"
          onChange={handleUpload}
        />
      </div>

      <Show when={error()}>
        <p class="text-sm text-red-500">{error()}</p>
      </Show>

      <Show when={props.value}>
        <div class="relative border border-slate-700 rounded-lg overflow-hidden">
          <img
            src={props.value}
            alt="Preview"
            class="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            class="absolute top-2 right-2"
            onClick={() => props.onChange("")}
          >
            Remove
          </Button>
        </div>
      </Show>
    </div>
  );
}
