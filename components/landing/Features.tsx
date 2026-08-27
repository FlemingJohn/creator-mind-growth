import { BellIcon } from "@/components/icons/BellIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { MindIcon } from "@/components/icons/MindIcon";
import { ReadIcon } from "@/components/icons/ReadIcon";
import { DashboardPreview } from "./DashboardPreview";

const points = [
  {
    title: "It reads",
    body: "Every comment on your channel, grouped by what people keep asking for."
  },
  {
    title: "It remembers",
    body: "Your audience, your history, and what it already told you to do."
  },
  {
    title: "It marks itself",
    body: "When you make something it suggested, it checks how it went and says so."
  },
  {
    title: "It speaks first",
    body: "When something starts repeating, it reaches you before you think to look."
  }
];

export function Features() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-5xl space-y-12 px-6">
        <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
          <h2 className="text-balance text-4xl font-semibold tracking-tight">
            YouTube tells you what your audience watched
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-[var(--muted)] sm:ml-auto">
            Creator Mind Growth remembers what your audience asked for, and whether the advice it gave you actually
            worked.
          </p>
        </div>

        <div className="relative rounded-[18px] border border-[var(--edge)] bg-[var(--panel)]/40 p-3 md:-mx-8">
          <DashboardPreview />
        </div>

        <div className="relative mx-auto grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {points.map(function drawPoint(point, index) {
            return (
              <div key={point.title} className="space-y-3">
                <div className="flex items-center gap-2">
                  {index === 0 ? <ReadIcon /> : null}
                  {index === 1 ? <MindIcon size={18} /> : null}
                  {index === 2 ? <CheckIcon size={18} /> : null}
                  {index === 3 ? <BellIcon /> : null}
                  <h3 className="text-[13.5px] font-medium tracking-tight">{point.title}</h3>
                </div>
                <p className="text-[13px] leading-relaxed text-[var(--muted)]">{point.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
