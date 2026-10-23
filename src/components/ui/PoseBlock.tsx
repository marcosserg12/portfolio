import { AlphaVideo } from "./AlphaVideo";

type PoseBlockProps = {
  pose: string;
  alt: string;
  className?: string;
  caption?: string;
  animated?: boolean;
  /** Pose whose hand reaches below the block (e.g. pointing down at the window under it). */
  reachBelow?: boolean;
};

/**
 * The avatar standing in a blue block, breaking out of its top edge (from the MarcOS sketch).
 * Poses with a clip play it (`/media/pose-<name>.webm`); the others are stills that float.
 */
export function PoseBlock({ pose, alt, className = "", caption, animated, reachBelow }: PoseBlockProps) {
  return (
    <div data-pose className={`relative h-[220px] w-[240px] shrink-0 md:h-[260px] md:w-[280px] ${reachBelow ? "z-10" : ""} ${className}`}>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[64%] rounded-[22px] bg-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_0_0_10px_rgb(47_93_184/0.14),0_24px_90px_rgb(47_93_184/0.45)]" />
      {/* clips the sides and the bottom to the block, never the top: the head breaks out above it */}
      <div className={`absolute inset-0 ${reachBelow ? "" : "overflow-x-clip [clip-path:inset(-100%_0_0_0_round_22px)]"}`}>
        {animated ? (
          // the clip is wider than the block: a flex row centres it and lets it overflow evenly on both sides
          <div className="absolute inset-0 flex items-end justify-center">
            <AlphaVideo
              src={`/media/pose-${pose}.webm`}
              poster={`/media/pose-${pose}-poster.webp`}
              alt={alt}
              className="h-[122%] w-auto max-w-none shrink-0 object-contain object-bottom"
            />
          </div>
        ) : reachBelow ? (
          // the torso's flat cut sits at 82% of the image: aligned with the block's bottom edge, the hand hangs below it
          <img src={`/img/poses/${pose}.webp`} alt={alt} loading="lazy" draggable={false} className="float absolute inset-x-0 bottom-[-21%] mx-auto h-[120%] w-auto max-w-none object-contain object-bottom" />
        ) : (
          <img src={`/img/poses/${pose}.webp`} alt={alt} loading="lazy" draggable={false} className="float absolute inset-x-0 bottom-[-10px] mx-auto h-[calc(100%+4px)] w-auto max-w-none object-contain object-bottom" />
        )}
      </div>
      {caption && (
        <span className="absolute right-3 top-[calc(36%+12px)] rounded-md bg-night/80 px-2 py-1 font-mono text-[11px] text-paper">{caption}</span>
      )}
    </div>
  );
}
