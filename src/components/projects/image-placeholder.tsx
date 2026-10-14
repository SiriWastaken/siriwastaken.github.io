import type { ImageSlot } from "@/assets/projects";

type ImagePlaceholderProps = {
  slug: string;
  slot: ImageSlot;
  className?: string;
};

/** Stand-in frame for an image that hasn't been taken yet. Development only by default. */
export function ImagePlaceholder({
  slug,
  slot,
  className = "",
}: ImagePlaceholderProps) {
  const portrait = slot.aspect === "9/19.5";
  return (
    <figure className={className}>
      <div
        role="img"
        aria-label={`Image placeholder: ${slot.subject}`}
        style={{ aspectRatio: slot.aspect }}
        className={`flex w-full flex-col justify-between gap-4 border border-dashed border-rule-strong bg-surface p-5 sm:p-6 ${portrait ? "max-w-xs" : ""}`}
      >
        <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
          Placeholder · {slot.kind} · {slot.aspect.replace("/", ":")}
        </span>
        <div>
          <p className="max-w-md text-sm font-medium text-balance">
            {slot.subject}
          </p>
          <p className="mt-2 font-mono text-[11px] break-all text-muted">
            assets/projects/{slug}/{slot.file}
          </p>
        </div>
      </div>
      {slot.caption ? (
        <figcaption className="mt-3 font-mono text-xs text-muted">
          {slot.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
