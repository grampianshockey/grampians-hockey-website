import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const GalleryTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  const { data: images, isLoading } = useQuery({
    queryKey: ["admin_team_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_gallery")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a JPEG, PNG, WebP, or GIF image.", variant: "destructive" });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" });
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("team-gallery")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("team-gallery")
        .getPublicUrl(fileName);

      const maxOrder = images?.reduce((max, img) => Math.max(max, img.display_order), -1) ?? -1;

      const { error: insertError } = await supabase.from("team_gallery").insert({
        image_url: urlData.publicUrl,
        caption: caption || null,
        display_order: maxOrder + 1,
      });

      if (insertError) throw insertError;

      setCaption("");
      queryClient.invalidateQueries({ queryKey: ["admin_team_gallery"] });
      queryClient.invalidateQueries({ queryKey: ["team_gallery"] });
      toast({ title: "Photo uploaded successfully" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (image: GalleryImage) => {
      const urlParts = image.image_url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from("team-gallery").remove([fileName]);
      const { error } = await supabase.from("team_gallery").delete().eq("id", image.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_team_gallery"] });
      queryClient.invalidateQueries({ queryKey: ["team_gallery"] });
      toast({ title: "Photo deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    },
  });

  const swapOrderMutation = useMutation({
    mutationFn: async ({ id1, order1, id2, order2 }: { id1: string; order1: number; id2: string; order2: number }) => {
      await Promise.all([
        supabase.from("team_gallery").update({ display_order: order1 }).eq("id", id1),
        supabase.from("team_gallery").update({ display_order: order2 }).eq("id", id2),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_team_gallery"] });
      queryClient.invalidateQueries({ queryKey: ["team_gallery"] });
    },
  });

  const handleReorder = (index: number, direction: "up" | "down") => {
    if (!images) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    const current = images[index];
    const swap = images[swapIndex];

    swapOrderMutation.mutate({
      id1: current.id,
      order1: swap.display_order,
      id2: swap.id,
      order2: current.display_order,
    });
  };

  const updateCaptionMutation = useMutation({
    mutationFn: async ({ id, caption }: { id: string; caption: string }) => {
      const { error } = await supabase
        .from("team_gallery")
        .update({ caption: caption || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_team_gallery"] });
      queryClient.invalidateQueries({ queryKey: ["team_gallery"] });
      toast({ title: "Caption updated" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Upload New Photo</h3>
          <p className="text-sm text-muted-foreground">Max 5MB. Accepted formats: JPEG, PNG, WebP, GIF.</p>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Round 5 vs Ballarat Bears"
            />
          </div>
          <div>
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Button asChild disabled={uploading}>
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? "Uploading..." : "Choose Photo"}
                  </label>
                </Button>
              </div>
            </Label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Gallery Images ({images?.length ?? 0})
        </h3>
        {images?.map((image, index) => (
          <Card key={image.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <img
                src={image.image_url}
                alt={image.caption || "Gallery image"}
                className="w-20 h-20 object-cover rounded-md border"
              />
              <div className="flex-1 min-w-0">
                <Input
                  defaultValue={image.caption || ""}
                  placeholder="Add caption..."
                  onBlur={(e) => {
                    if (e.target.value !== (image.caption || "")) {
                      updateCaptionMutation.mutate({ id: image.id, caption: e.target.value });
                    }
                  }}
                  className="text-sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReorder(index, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReorder(index, "down")}
                  disabled={index === (images?.length ?? 0) - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Photo</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete this photo? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(image)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
        {images?.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No photos yet. Upload your first team photo above.
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryTab;
