import Image from "next/image";
import type { ProjectImage as ProjectImageData } from "@/assets/projects";

type ProjectImageProps = {
  image: ProjectImageData;
  sizes: string;
  eager?: boolean;
  className?: string;
};

/** A framed project image. Never upscaled past its intrinsic width. */
export function ProjectImage({ image, sizes, eager = false, className = "" }: ProjectImageProps) {
  return (
    <figure className={className}>
      <Image
        src={image.src}
        alt={image.alt}
        sizes={sizes}
        placeholder="blur"
        loading={eager ? "eager" : "lazy"}
        className="h-auto w-full"
        style={{ maxWidth: image.src.width }}
      />
      {image.caption ? <figcaption className="mt-3 font-mono text-xs text-muted">{image.caption}</figcaption> : null}
    </figure>
  );
}
