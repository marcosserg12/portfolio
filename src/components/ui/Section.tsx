import type { ReactNode, Ref } from "react";

export function Section({ id, ref, className = "", children }: { id: string; ref?: Ref<HTMLElement>; className?: string; children: ReactNode }) {
  return (
    <section id={id} ref={ref} aria-labelledby={`${id}-title`} className={`scroll-mt-14 pt-20 md:pt-24 ${className}`}>
      {children}
    </section>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1320px] px-page ${className}`}>{children}</div>;
}

export function SectionTitle({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <h2 id={`${id}-title`} data-reveal className={`text-[clamp(36px,4.6vw,60px)] font-semibold leading-none tracking-[-0.04em] text-balance text-ink ${className}`}>
      {children}
    </h2>
  );
}

export function SectionIntro({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p data-reveal className={`max-w-[520px] text-lg leading-normal text-muted ${className}`}>{children}</p>;
}

/** A desktop widget: frosted glass on the wallpaper, like the widgets macOS pins to the desktop. */
export function Widget({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-[22px] shadow-[0_18px_40px_-20px_rgb(20_40_90/0.45)] ${className}`}>{children}</div>;
}

/** Section header: the title widget on the left, the avatar's pose on the right. */
export function SectionHead({ id, title, intro, pose }: { id: string; title: string; intro?: string; pose?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 md:mb-10">
      <Widget className="w-full max-w-[640px] p-6 md:w-auto md:p-8">
        <SectionTitle id={id}>{title}</SectionTitle>
        {intro && <SectionIntro className="mt-4">{intro}</SectionIntro>}
      </Widget>
      {pose}
    </div>
  );
}
