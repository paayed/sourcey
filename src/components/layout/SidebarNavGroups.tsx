import type { SiteNavGroup, SiteNavItem } from "../../core/navigation.js";

function MethodPill({ method }: { method: string }) {
  const m = method.toUpperCase();
  const label = m === "DELETE" ? "DEL" : m;

  const colors: Record<string, string> = {
    GET: "bg-green-400/20 dark:bg-green-400/20 text-green-700 dark:text-green-400",
    POST: "bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-400",
    PUT: "bg-yellow-400/20 dark:bg-yellow-400/20 text-yellow-700 dark:text-yellow-400",
    DELETE: "bg-red-400/20 dark:bg-red-400/20 text-red-700 dark:text-red-400",
    DEL: "bg-red-400/20 dark:bg-red-400/20 text-red-700 dark:text-red-400",
    PATCH: "bg-orange-400/20 dark:bg-orange-400/20 text-orange-700 dark:text-orange-400",
  };

  return (
    <span class="flex items-center w-8 h-lh shrink-0">
      <span class={`px-1 py-0.5 rounded-md text-[0.55rem] leading-tight font-bold ${colors[m] ?? "bg-gray-400/20 text-gray-700"}`}>
        {label}
      </span>
    </span>
  );
}

function GroupChevron() {
  return (
    <svg class="sidebar-nav-group-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GroupIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();

  if (lower.includes("auth")) {
    return (
      <svg class="sidebar-nav-group-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 3 19 6v6c0 4.4-2.9 7.9-7 9-4.1-1.1-7-4.6-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9.5 12 1.7 1.7 3.3-3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (lower.includes("store")) {
    return (
      <svg class="sidebar-nav-group-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M4 9.5 5.5 5h13L20 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v8.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (lower.includes("model")) {
    return (
      <svg class="sidebar-nav-group-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg class="sidebar-nav-group-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 18h4V6H4v12Zm6 0h4V10h-4v8Zm6 0h4V3h-4v15Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavItems({
  items,
  activePageSlug,
  base,
  className = "",
}: {
  items: SiteNavItem[];
  activePageSlug: string | null;
  base: string;
  className?: string;
}) {
  return (
    <ul class={className}>
      {items.map((item) => {
        const isActive = item.id === activePageSlug;
        return (
          <li key={item.id}>
            <a
              href={`${base}${item.href}`}
              class={`nav-link${isActive ? " active" : ""}`}
            >
              {item.method && <MethodPill method={item.method} />}
              <span class="flex-1 wrap-break-word [word-break:break-word]">{item.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function SidebarNavGroups({
  groups,
  activePageSlug,
  base,
}: {
  groups: SiteNavGroup[];
  activePageSlug: string | null;
  base: string;
}) {
  return (
    <div class="sidebar-nav-groups">
      {groups.map((group, index) => {
        const isOpen = group.items.some((item) => item.id === activePageSlug);

        if (!group.label) {
          return (
            <div key={`group-${index}`} class={index > 0 ? "mt-4" : ""}>
              <NavItems items={group.items} activePageSlug={activePageSlug} base={base} />
            </div>
          );
        }

        return (
          <details
            key={`${group.label}-${index}`}
            class={`sidebar-nav-group${index > 0 ? " mt-3" : ""}`}
            open={isOpen}
          >
            <summary class="sidebar-nav-group-trigger">
              <span class="sidebar-nav-group-label">
                <GroupIcon label={group.label} />
                <span>{group.label}</span>
              </span>
              <GroupChevron />
            </summary>
            <NavItems
              items={group.items}
              activePageSlug={activePageSlug}
              base={base}
              className="sidebar-nav-group-items"
            />
          </details>
        );
      })}
    </div>
  );
}
