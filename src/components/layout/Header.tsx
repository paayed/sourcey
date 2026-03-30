import { useContext } from "preact/hooks";
import { NavigationContext, OptionsContext, SiteContext } from "../../renderer/context.js";
import { SocialIcon } from "../ui/SocialIcon.js";
import type { SiteNavigation } from "../../core/navigation.js";

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="min-w-4 flex-none">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" class="h-4 w-4 block dark:hidden">
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 1.11V2" />
        <path d="M12.87 3.13L12.24 3.76" />
        <path d="M14.89 8H14" />
        <path d="M12.87 12.87L12.24 12.24" />
        <path d="M8 14.89V14" />
        <path d="M3.13 12.87L3.76 12.24" />
        <path d="M1.11 8H2" />
        <path d="M3.13 3.13L3.76 3.76" />
        <circle cx="8" cy="8" r="3.78" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4 hidden dark:block">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function BreadcrumbChevron() {
  return (
    <svg width="3" height="24" viewBox="0 -9 3 24" class="h-5 overflow-visible shrink-0">
      <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Mobile breadcrumb bar — shows group > page on small screens.
 */
function MobileBreadcrumbs({ nav }: { nav: SiteNavigation }) {
  const activeTab = nav.tabs.find((t) => t.slug === nav.activeTabSlug);
  const activePage = activeTab?.groups
    .flatMap((g) => g.items)
    .find((item) => item.id === nav.activePageSlug);

  return (
    <div class="flex lg:hidden items-center h-12 px-4 text-sm overflow-hidden border-t border-[rgb(var(--color-gray-200)/0.7)] dark:border-[rgb(var(--color-gray-300)/0.06)]">
      <div class="flex items-center min-w-0 space-x-3 leading-6 whitespace-nowrap">
        {nav.tabs.length > 1 && activeTab && activePage?.label !== activeTab.label && (
          <div class="flex items-center space-x-3 shrink-0 text-[rgb(var(--color-gray-500))] dark:text-[rgb(var(--color-gray-400))]">
            <span>{activeTab.label}</span>
            <BreadcrumbChevron />
          </div>
        )}
        {activePage && (
          <span class="font-semibold text-[rgb(var(--color-gray-900))] dark:text-[rgb(var(--color-gray-200))] truncate min-w-0">
            {activePage.label}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Site header.
 *
 * Desktop (lg+):
 *   - Fixed bar that starts at left:18rem (right edge of sidebar).
 *   - When sidebar collapses to icon strip, header shifts left to 3.5rem
 *     (icon strip width) — NOT to 0, so it stays aligned with content.
 *
 * Mobile:
 *   - Full-width bar with logo + search icon + hamburger.
 *   - Breadcrumb strip below shows current group > page.
 */
export function Header() {
  const nav = useContext(NavigationContext);
  const options = useContext(OptionsContext);
  const site = useContext(SiteContext);

  const base = options.assetBase;

  return (
    <>
      {/* ══════════════════════════════════════════
          Desktop header — offset right of sidebar
          ══════════════════════════════════════════ */}
      <div
        id="navbar"
        class="z-20 hidden lg:flex flex-col fixed top-0 right-0
               bg-[rgb(var(--color-background-light))] dark:bg-[rgb(var(--color-background-dark))]
               border-b border-[rgb(var(--color-gray-200)/0.7)] dark:border-[rgb(var(--color-gray-300)/0.06)]
               transition-[left] duration-200"
        style="left: 18rem;"
      >
        {/* ── Main row ── */}
        <div class="flex items-center h-16 px-6 gap-x-4 min-w-0">

          {/* Spacer */}
          <div class="flex-1" />

          {/* Search */}
          <button
            id="search-open"
            type="button"
            aria-label="Search"
            class="flex items-center text-sm h-9 px-3 rounded-full gap-2 cursor-pointer w-60
                   text-[rgb(var(--color-gray-500))] dark:text-[rgb(var(--color-gray-400))]
                   ring-1 ring-[rgb(var(--color-gray-400)/0.3)] hover:ring-[rgb(var(--color-gray-500)/0.4)]
                   dark:ring-[rgb(var(--color-gray-600)/0.3)] dark:hover:ring-[rgb(var(--color-gray-500)/0.3)]
                   bg-[rgb(var(--color-background-light))] dark:bg-[rgb(var(--color-background-dark))]
                   dark:brightness-110 dark:hover:brightness-125 transition-all"
          >
            <SearchIcon />
            <span class="text-[rgb(var(--color-gray-400))] text-sm">Search docs...</span>
          </button>

          {/* Nav links */}
          <nav class="text-sm">
            <ul class="flex items-center">
              {site.navbar.links.length > 0
                ? site.navbar.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="px-3 py-1.5 font-medium
                               text-[rgb(var(--color-gray-600))] hover:text-[rgb(var(--color-gray-900))]
                               dark:text-[rgb(var(--color-gray-400))] dark:hover:text-[rgb(var(--color-gray-200))]
                               transition-colors"
                    >
                      {link.type === "link"
                        ? (link.label ?? link.href)
                        : (
                          <>
                            <SocialIcon type={link.type} />
                            {link.label && <span class="ml-1">{link.label}</span>}
                          </>
                        )}
                    </a>
                  </li>
                ))
                : nav.tabs.map((tab) => (
                  <li key={tab.slug}>
                    <a
                      href={`${base}${tab.href}`}
                      class="px-3 py-1.5 font-medium
                               text-[rgb(var(--color-gray-600))] hover:text-[rgb(var(--color-gray-900))]
                               dark:text-[rgb(var(--color-gray-400))] dark:hover:text-[rgb(var(--color-gray-200))]
                               transition-colors"
                    >
                      {tab.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Primary CTA */}
          {site.navbar.primary && (
            <a
              href={site.navbar.primary.href}
              target="_blank"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold
                     text-white bg-[rgb(var(--color-primary-dark))] hover:opacity-90
                     transition-opacity whitespace-nowrap"
            >
              {site.navbar.primary.label}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}

          {/* Theme toggle */}
          <button
            id="theme-toggle"
            type="button"
            aria-label="Toggle theme"
            class="p-2 flex items-center justify-center cursor-pointer rounded-md
                   text-[rgb(var(--color-gray-400))] hover:text-[rgb(var(--color-gray-600))]
                   dark:text-[rgb(var(--color-gray-500))] dark:hover:text-[rgb(var(--color-gray-300))]
                   hover:bg-[rgb(var(--color-gray-100))] dark:hover:bg-[rgb(var(--color-gray-800)/0.5)]
                   transition-colors"
          >
            <SunIcon />
            <MoonIcon />
          </button>
        </div>

        {/* ── Tab row (only when multiple tabs) ── */}
        {nav.tabs.length > 1 && (
          <div class="flex h-10 px-6 border-t border-[rgb(var(--color-gray-200)/0.5)] dark:border-[rgb(var(--color-gray-300)/0.06)]">
            <div class="h-full flex text-sm gap-x-6">
              {nav.tabs.map((tab) => {
                const isActive = tab.slug === nav.activeTabSlug;
                return (
                  <a
                    key={tab.slug}
                    href={`${base}${tab.href}`}
                    class={`group relative h-full flex items-center gap-2 font-medium cursor-pointer transition-colors ${isActive
                        ? "text-[rgb(var(--color-gray-800))] dark:text-[rgb(var(--color-gray-200))]"
                        : "text-[rgb(var(--color-gray-500))] dark:text-[rgb(var(--color-gray-400))] hover:text-[rgb(var(--color-gray-800))] dark:hover:text-[rgb(var(--color-gray-300))]"
                      }`}
                  >
                    {tab.label}
                    {isActive && (
                      <div class="absolute bottom-0 h-[2px] w-full left-0 bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary-light))]" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          Mobile header — full width
          ══════════════════════════════════════════ */}
      <div
        id="navbar-mobile"
        class="z-30 lg:hidden fixed top-0 left-0 right-0
               bg-[rgb(var(--color-background-light))] dark:bg-[rgb(var(--color-background-dark))]
               border-b border-[rgb(var(--color-gray-200)/0.7)] dark:border-[rgb(var(--color-gray-300)/0.06)]"
      >
        <div class="flex items-center h-14 px-4 gap-x-3">
          {/* Logo on mobile (sidebar not visible on mobile) */}
          <a href={`${base}${nav.tabs[0]?.href ?? ""}`} class="flex items-center flex-shrink-0">
            <img
              src={`${base}assets/logo.png`}
              alt={site.name ?? "Logo"}
              class="h-7 w-auto object-contain"
            />
          </a>

          <div class="flex-1" />

          <button id="search-open-mobile" type="button" aria-label="Search"
            class="text-[rgb(var(--color-gray-500))] w-8 h-8 flex items-center justify-center">
            <SearchIcon />
          </button>

          <button type="button" data-drawer-slide="right" aria-label="Open menu"
            class="text-[rgb(var(--color-gray-500))] w-8 h-8 flex items-center justify-center hover:text-[rgb(var(--color-gray-700))]">
            <svg class="h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
            </svg>
          </button>
        </div>

        <MobileBreadcrumbs nav={nav} />
      </div>

      {/* ══════════════════════════════════════════
          Script: sync header left offset with sidebar state
          ══════════════════════════════════════════ */}
      <script dangerouslySetInnerHTML={{
        __html: `
(function () {
  var SIDEBAR_FULL_WIDTH = '18rem';
  var SIDEBAR_ICON_WIDTH = '3.5rem'; // collapsed icon-strip width
  var navbar = document.getElementById('navbar');

  function syncLeft() {
    var sidebar = document.getElementById('sidebar');
    if (!navbar) return;
    navbar.style.left = (sidebar && sidebar.classList.contains('sidebar-collapsed'))
      ? SIDEBAR_ICON_WIDTH
      : SIDEBAR_FULL_WIDTH;
  }

  function init() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar && navbar) {
      new MutationObserver(syncLeft).observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
    syncLeft();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
        `,
      }} />
    </>
  );
}
