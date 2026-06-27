import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

const TeamGallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ["team_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_gallery")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null; // Don't show the section if no images
  }

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm font-medium text-primary mb-4">
            <ImageIcon className="h-4 w-4" />
            Gallery
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Team Photos
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <img
                src={image.image_url}
                alt={image.caption || "Team photo"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm text-left">{image.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
          {selectedImage && (
            <div className="flex flex-col">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.caption || "Team photo"}
                className="w-full max-h-[80vh] object-contain"
              />
              {selectedImage.caption && (
                <p className="text-white/90 text-center py-4 px-6">
                  {selectedImage.caption}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TeamGallery;
