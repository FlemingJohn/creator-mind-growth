import { MarkIcon } from "@/components/icons/MarkIcon";
import { MindIcon } from "@/components/icons/MindIcon";

interface SidebarProps {
  mindName: string;
  activePage: string;
  onChangePage: (page: string) => void;
}

const pages = ["Today", "Track Record", "Audience", "Journey"];

export function Sidebar({ mindName, activePage, onChangePage }: SidebarProps) {
  return (
    <aside className="flex shrink-0 flex-col border-b border-[var(--edge)] bg-[var(--panel)]/40 px-4 py-4 sm:px-6 lg:w-[212px] lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center justify-between gap-3 lg:block">
        <div className="flex items-center gap-2.5">
          <MarkIcon />
          <div className="leading-tight">
            <p className="text-[13px] font-semibold tracking-tight text-[var(--ink)]">CMG</p>
            <p className="text-[10px] tracking-[0.06em] text-[var(--faint)]">Creator Mind Growth</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 lg:hidden">
          <MindIcon size={22} />
          <p className="truncate text-[12px] text-[var(--muted)]">{mindName}</p>
        </div>
      </div>

      <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-9 lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {pages.map(function drawPage(page) {
          const active = page === activePage;
          return (
            <button
              key={page}
              type="button"
              onClick={function choose() {
                onChangePage(page);
              }}
              className={`relative shrink-0 rounded-[8px] px-3 py-2 text-left text-[13px] transition-colors duration-200 ${
                active ? "bg-[var(--edge)]/50 text-[var(--ink)]" : "text-[var(--faint)] hover:text-[var(--muted)]"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 hidden h-4 w-[2px] -translate-y-1/2 rounded-full bg-[var(--accent)] transition-opacity duration-200 lg:block ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              {page}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden items-center gap-3 border-t border-[var(--edge)] pt-5 lg:flex">
        <MindIcon />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[12.5px] font-medium text-[var(--ink)]">{mindName}</p>
          <p className="text-[10.5px] text-[var(--faint)]">your Mind</p>
        </div>
      </div>
    </aside>
  );
}
