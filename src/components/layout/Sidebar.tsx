import { useContext } from "preact/hooks";
import { NavigationContext, OptionsContext, SiteContext } from "../../renderer/context.js";
import { SocialIcon, socialLabels } from "../ui/SocialIcon.js";
import type { SiteNavGroup } from "../../core/navigation.js";

/**
 * Colored method badges for API sidebar items.
 */
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
    <span class="flex items-center w-8 h-[1lh] shrink-0">
      <span class={`px-1 py-0.5 rounded-md text-[0.55rem] leading-tight font-bold ${colors[m] ?? "bg-gray-400/20 text-gray-700"}`}>
        {label}
      </span>
    </span>
  );
}

/**
 * Nav groups — shared between desktop sidebar and mobile drawer.
 */
function NavGroups({ groups, activePageSlug, base }: {
  groups: SiteNavGroup[];
  activePageSlug: string | null;
  base: string;
}) {
  return (
    <>
      {groups.map((group, gi) => (
        <div key={group.label} class={gi > 0 ? "mt-5" : ""}>
          {group.label && (
            <h5 class="nav-group-label">{group.label}</h5>
          )}
          <ul>
            {group.items.map((item) => {
              const isActive = item.id === activePageSlug;
              return (
                <li key={item.id}>
                  <a
                    href={`${base}${item.href}`}
                    class={`nav-link${isActive ? " active" : ""}`}
                  >
                    {item.method && <MethodPill method={item.method} />}
                    <span class="flex-1 break-words [word-break:break-word]">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

function DropdownChevron() {
  return (
    <svg class="drawer-dropdown-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Sidebar panel icon — shown when sidebar is OPEN (to collapse it) */
function SidebarPanelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 1V15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * API Reference icon — shown in the icon strip when sidebar is COLLAPSED.
 * Represents a code/API document.
 */
function ApiReferenceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7h6M7 10.5h4M7 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 16l2.5 2.5L14 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 16l-2.5 2.5L19 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Sidebar component.
 *
 * Desktop: Fixed full-height panel starting at top:0.
 *
 * COLLAPSED state: Instead of fully hiding, sidebar shrinks to a narrow
 * icon strip (3rem wide). The strip shows:
 *   - Top: expand/open button
 *   - Middle: API Reference icon (tooltip on hover)
 *
 * Mobile: hidden — a dialog drawer is used instead.
 */
export function Sidebar() {
  const nav = useContext(NavigationContext);
  const options = useContext(OptionsContext);
  const site = useContext(SiteContext);
  const activeTab = nav.tabs.find((t) => t.slug === nav.activeTabSlug);
  if (!activeTab) return null;

  const base = options.assetBase;
  const { links } = site.navbar;
  const primaryAction = site.navbar.primary;
  const groups = activeTab.groups;
  const logoHref = site.logo?.href ?? `${base}${nav.tabs[0]?.href ?? ""}`;

  return (
    <>
      {/* ══════════════════════════════════════════
          Sidebar toggle script
          ══════════════════════════════════════════ */}
      <script dangerouslySetInnerHTML={{
        __html: `
(function () {
  var STORAGE_KEY = 'sidebar-collapsed';

  function applyState(collapsed) {
    var sidebar = document.getElementById('sidebar');
    var docsRoot = document.getElementById('docs');
    if (!sidebar) return;

    if (collapsed) {
      sidebar.classList.add('sidebar-collapsed');
      if (docsRoot) docsRoot.classList.add('sidebar-collapsed');
    } else {
      sidebar.classList.remove('sidebar-collapsed');
      if (docsRoot) docsRoot.classList.remove('sidebar-collapsed');
    }

    document.querySelectorAll('[data-sidebar-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  function toggle() {
    var sidebar = document.getElementById('sidebar');
    var collapsed = sidebar ? sidebar.classList.contains('sidebar-collapsed') : false;
    try { localStorage.setItem(STORAGE_KEY, !collapsed ? '1' : '0'); } catch (e) {}
    applyState(!collapsed);
  }

  function wireToggles() {
    document.querySelectorAll('[data-sidebar-toggle]').forEach(function (btn) {
      if (!btn._sidebarWired) {
        btn._sidebarWired = true;
        btn.addEventListener('click', toggle);
      }
    });
  }

  // Restore persisted state immediately (before paint)
  var persisted = false;
  try { persisted = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) {}
  applyState(persisted);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireToggles);
  } else {
    wireToggles();
  }
})();
      ` }} />

      {/* ══════════════════════════════════════════
          Desktop sidebar — fixed, full height from top:0
          ══════════════════════════════════════════ */}
      <div
        id="sidebar"
        class="z-30 hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[18rem]
               bg-[rgb(var(--color-background-light))] dark:bg-[rgb(var(--color-background-dark))]
               border-r border-[rgb(var(--color-gray-200)/0.7)] dark:border-[rgb(var(--color-gray-300)/0.06)]
               transition-[width] duration-200 overflow-hidden"
      >
        {/* ── Top bar: Logo + collapse button ── */}
        <div class="sidebar-topbar flex items-center justify-between px-5 h-16 shrink-0
                    border-b border-[rgb(var(--color-gray-200)/0.7)] dark:border-[rgb(var(--color-gray-300)/0.06)]">
          {/* Logo — hidden when collapsed */}
          <a href={logoHref} class="sidebar-logo flex items-center min-w-0 flex-shrink-0 overflow-hidden transition-all duration-200">
            <img
              src={`${base}assets/logo.png`}
              alt={site.name ?? "Logo"}
              class="h-7 w-auto object-contain"
            />
          </a>

          {/* Collapse / Expand button — always visible */}
          <button
            type="button"
            data-sidebar-toggle
            aria-label="Toggle sidebar"
            aria-expanded="true"
            class="flex-shrink-0 p-1.5 rounded-md
                   text-[rgb(var(--color-gray-400))] hover:text-[rgb(var(--color-gray-600))]
                   dark:text-[rgb(var(--color-gray-500))] dark:hover:text-[rgb(var(--color-gray-300))]
                   hover:bg-[rgb(var(--color-gray-100))] dark:hover:bg-[rgb(var(--color-gray-800)/0.5)]
                   transition-colors"
          >
            <SidebarPanelIcon />
          </button>
        </div>

        {/* ── Icon strip — only visible when collapsed ── */}
        <div class="sidebar-icon-strip flex flex-col items-center gap-4 pt-4 flex-1">
          {/* API Reference icon with tooltip */}
          <div class="relative group">
            <button
              type="button"
              data-sidebar-toggle
              aria-label="Open sidebar — API Reference"
              class="p-2 rounded-md
                     text-[rgb(var(--color-gray-400))] hover:text-[rgb(var(--color-primary))]
                     dark:text-[rgb(var(--color-gray-500))] dark:hover:text-[rgb(var(--color-primary-light))]
                     hover:bg-[rgb(var(--color-gray-100))] dark:hover:bg-[rgb(var(--color-gray-800)/0.5)]
                     transition-colors"
            >
              <ApiReferenceIcon />
            </button>
            {/* Tooltip */}
            <div class="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2
                        px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap
                        bg-[rgb(var(--color-gray-800))] text-[rgb(var(--color-gray-100))]
                        dark:bg-[rgb(var(--color-gray-100))] dark:text-[rgb(var(--color-gray-900))]
                        opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50
                        shadow-md">
              API Reference
            </div>
          </div>
        </div>

        {/* ── Scrollable nav — hidden when collapsed ── */}
        <div class="sidebar-nav-content flex-1 overflow-y-auto overflow-x-hidden">
          <div class="px-4 pt-5 pb-10 text-sm leading-6">
            <nav id="nav" role="navigation">
              <NavGroups groups={groups} activePageSlug={nav.activePageSlug} base={base} />
            </nav>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Mobile drawer
          ══════════════════════════════════════════ */}
      <dialog id="mobile-nav" class="mobile-nav-dialog">
        {/* Drawer header with logo */}
        <div class="flex items-center px-4 py-4 border-b border-[rgb(var(--color-gray-200)/0.7)] dark:border-[rgb(var(--color-gray-800)/0.5)] shrink-0">
          <img
            src={`${base}assets/logo.png`}
            alt={site.name ?? "Logo"}
            class="h-6 w-auto object-contain"
          />
        </div>

        {/* Tab dropdown — only when multiple tabs */}
        {nav.tabs.length > 1 && (
          <div class="pt-5 px-4 shrink-0">
            <div class="drawer-dropdown">
              <button
                id="drawer-group-toggle"
                type="button"
                class="drawer-dropdown-trigger"
                aria-expanded="false"
              >
                <span class="drawer-dropdown-label">{activeTab.label}</span>
                <DropdownChevron />
              </button>
              <ul id="drawer-group-list" class="drawer-dropdown-list" style="display:none">
                {nav.tabs.map((tab) => (
                  <li key={tab.slug}>
                    <a
                      href={`${base}${tab.href}`}
                      class={`drawer-dropdown-item${tab.slug === nav.activeTabSlug ? " active" : ""}`}
                    >
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Nav content */}
        <nav class="pt-5 pb-3 px-4 flex-1 overflow-y-auto">
          <NavGroups groups={groups} activePageSlug={nav.activePageSlug} base={base} />
        </nav>

        {/* Footer links + CTA */}
        {(links.length > 0 || primaryAction) && (
          <div class="px-4 py-3 border-t border-[rgb(var(--color-gray-200)/0.7)] dark:border-[rgb(var(--color-gray-800)/0.5)] shrink-0">
            <ul class="space-y-3">
              {links.map((link) => {
                const label = link.label ?? socialLabels[link.type] ?? link.href;
                return (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer"
                      class="flex items-center gap-2.5 text-[rgb(var(--color-gray-600))] hover:text-[rgb(var(--color-gray-900))] dark:text-[rgb(var(--color-gray-400))] dark:hover:text-[rgb(var(--color-gray-200))]">
                      {link.type !== "link" && <SocialIcon type={link.type} />}
                      <span>{label}</span>
                    </a>
                  </li>
                );
              })}
              {primaryAction && (
                <li>
                  <a href={primaryAction.href} target="_blank"
                    class="group relative flex items-center justify-center px-4 py-2 text-sm font-medium">
                    <span class="absolute inset-0 bg-[rgb(var(--color-primary-dark))] rounded-lg group-hover:opacity-90" />
                    <span class="z-10 text-white">{primaryAction.label}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </dialog>

      {/* ══════════════════════════════════════════
          Collapsed sidebar CSS + docs offset
          ══════════════════════════════════════════ */}
      <style>{`
        /* ── Default (expanded) state ── */

        /* Icon strip hidden when expanded */
        #sidebar .sidebar-icon-strip {
          display: none;
        }

        /* Nav content visible when expanded */
        #sidebar .sidebar-nav-content {
          display: flex;
          flex-direction: column;
        }

        /* ── Collapsed state: shrink to icon strip (3rem) ── */
        #sidebar.sidebar-collapsed {
          width: 3.5rem !important;
        }

        /* Hide logo when collapsed */
        #sidebar.sidebar-collapsed .sidebar-logo {
          width: 0;
          opacity: 0;
          pointer-events: none;
        }

        /* Center the toggle button in the top bar when collapsed */
        #sidebar.sidebar-collapsed .sidebar-topbar {
          justify-content: center;
          padding-left: 0;
          padding-right: 0;
        }

        /* Show icon strip when collapsed */
        #sidebar.sidebar-collapsed .sidebar-icon-strip {
          display: flex;
        }

        /* Hide nav content when collapsed */
        #sidebar.sidebar-collapsed .sidebar-nav-content {
          display: none;
        }

        /* Docs area: push right of sidebar on desktop */
        @media (min-width: 1024px) {
          #docs {
            padding-left: 18rem;
            transition: padding-left 0.2s;
          }
          /* Collapsed docs offset = icon strip width */
          #docs.sidebar-collapsed {
            padding-left: 3.5rem;
          }
        }
      `}</style>
    </>
  );
}