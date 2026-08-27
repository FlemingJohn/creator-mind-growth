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
    <aside className="flex w-[212px] shrink-0 flex-col border-r border-[var(--edge)] bg-[var(--panel)]/40 px-5 py-6">
      <div className="flex items-center gap-2.5">
        <MarkIcon />
        <div className="leading-tight">
          <p className="text-[13px] font-semibold tracking-tight text-[var(--ink)]">CMG</p>
          <p className="text-[10px] tracking-[0.06em] text-[var(--faint)]">Creator Mind Growth</p>
        </div>
      </div>

      <nav className="mt-9 flex flex-col gap-0.5">
        {pages.map(function drawPage(page) {
          const active = page === activePage;
          return (
            <button
              key={page}
              type="button"
              onClick={function choose() {
                onChangePage(page);
              }}
              className={`group relative rounded-[8px] px-3 py-2 text-left text-[13px] transition-colors duration-200 ${
                active ? "bg-[var(--edge)]/50 text-[var(--ink)]" : "text-[var(--faint)] hover:text-[var(--muted)]"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[var(--accent)] transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              {page}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-[var(--edge)] pt-5">
        <MindIcon />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[12.5px] font-medium text-[var(--ink)]">{mindName}</p>
          <p className="text-[10.5px] text-[var(--faint)]">your Mind</p>
        </div>
      </div>
    </aside>
  );
}
