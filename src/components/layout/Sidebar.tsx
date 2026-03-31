import { useContext } from "preact/hooks";
import { NavigationContext, OptionsContext, SiteContext } from "../../renderer/context.js";
import { SocialIcon, socialLabels } from "../ui/SocialIcon.js";
import { SidebarNavGroups } from "./SidebarNavGroups.js";

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
 * COLLAPSED state: Sidebar shrinks to a narrow icon strip (3.5rem wide).
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
          Desktop sidebar
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
          <a href={logoHref} class="sidebar-logo flex items-center min-w-0 shrink-0 overflow-hidden transition-all duration-200">
            <img
              src={`${base}assets/logo.png`}
              alt={site.name ?? "Logo"}
              class="h-7 w-auto object-contain"
            />
          </a>

          <button
            type="button"
            data-sidebar-toggle
            aria-label="Toggle sidebar"
            aria-expanded="true"
            class="shrink-0 p-1.5 rounded-md
                   text-[rgb(var(--color-gray-400))] hover:text-[rgb(var(--color-gray-600))]
                   dark:text-[rgb(var(--color-gray-500))] dark:hover:text-[rgb(var(--color-gray-300))]
                   hover:bg-[rgb(var(--color-gray-100))] dark:hover:bg-[rgb(var(--color-gray-800)/0.5)]
                   transition-colors"
          >
            <SidebarPanelIcon />
          </button>
        </div>

        {/* ── Scrollable nav ── */}
        <div class="sidebar-nav-content flex-1 overflow-y-auto overflow-x-hidden">
          <div class="px-4 pt-5 pb-10 text-sm leading-6">
            <nav id="nav" role="navigation">
              <SidebarNavGroups groups={groups} activePageSlug={nav.activePageSlug} base={base} />
            </nav>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Mobile drawer
          ══════════════════════════════════════════ */}
      <dialog id="mobile-nav" class="mobile-nav-dialog">
        <div class="flex items-center px-4 py-4 border-b border-[rgb(var(--color-gray-200)/0.7)] dark:border-[rgb(var(--color-gray-800)/0.5)] shrink-0">
          <img
            src={`${base}assets/logo.png`}
            alt={site.name ?? "Logo"}
            class="h-6 w-auto object-contain"
          />
        </div>

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

        <nav class="pt-5 pb-3 px-4 flex-1 overflow-y-auto">
          <SidebarNavGroups groups={groups} activePageSlug={nav.activePageSlug} base={base} />
        </nav>

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
          CSS — collapsed sidebar + nav group dropdowns
          ══════════════════════════════════════════ */}
      <style>{`
        /* ── Sidebar expanded state ── */

        #sidebar .sidebar-icon-strip {
          display: none;
        }

        #sidebar .sidebar-nav-content {
          display: flex;
          flex-direction: column;
        }

        /* ── Sidebar collapsed state ── */

        #sidebar.sidebar-collapsed {
          width: 3.5rem !important;
        }

        #sidebar.sidebar-collapsed .sidebar-logo {
          width: 0;
          opacity: 0;
          pointer-events: none;
        }

        #sidebar.sidebar-collapsed .sidebar-topbar {
          justify-content: center;
          padding-left: 0;
          padding-right: 0;
        }

        #sidebar.sidebar-collapsed .sidebar-icon-strip {
          display: flex;
        }

        #sidebar.sidebar-collapsed .sidebar-nav-content {
          display: none;
        }

        .sidebar-nav-group {
          margin: 0;
        }

        .sidebar-nav-group > summary {
          list-style: none;
        }

        .sidebar-nav-group > summary::-webkit-details-marker {
          display: none;
        }

        .sidebar-nav-group-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 0.625rem;
          color: rgb(var(--color-gray-700));
          transition: color 0.15s, background-color 0.15s;
          user-select: none;
        }

        .dark .sidebar-nav-group-trigger {
          color: rgb(var(--color-gray-300));
        }

        .sidebar-nav-group-trigger:hover {
          background: rgb(var(--color-gray-100) / 0.8);
        }

        .dark .sidebar-nav-group-trigger:hover {
          background: rgb(var(--color-gray-800) / 0.45);
        }

        .sidebar-nav-group-label {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          min-width: 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .sidebar-nav-group-icon {
          flex: none;
          color: rgb(var(--color-gray-500));
        }

        .dark .sidebar-nav-group-icon {
          color: rgb(var(--color-gray-400));
        }

        .sidebar-nav-group-chevron {
          flex: none;
          color: rgb(var(--color-gray-400));
          transition: transform 0.18s ease;
        }

        .sidebar-nav-group[open] .sidebar-nav-group-chevron {
          transform: rotate(180deg);
        }

        .sidebar-nav-group-items {
          list-style: none;
          margin: 0.25rem 0 0;
          padding: 0;
        }

        /* ── Docs area: push right of sidebar ── */

        @media (min-width: 1024px) {
          #docs {
            padding-left: 18rem;
            transition: padding-left 0.2s;
          }
          #docs.sidebar-collapsed {
            padding-left: 3.5rem;
          }
        }
      `}</style>
    </>
  );
}