/**
 * URL sync utility for the Zustand store.
 *
 * The store is the source of truth for UI state at runtime. This module
 * provides helpers to:
 *   1. Build the canonical URL from the current store UI state.
 *   2. Push the canonical URL to the browser address bar.
 *   3. Read the initial URL params on first hydration to seed the store.
 *
 * Deliberately kept free of React hooks so it can be used in Zustand
 * actions and subscriber callbacks.
 */

export type SidebarUIState = {
  areaSidebarOpen: boolean;
  selectedAreaSlug: string | null;
  toolsParam: string | null;
};

/**
 * Build a URL string from the current sidebar/tools UI state.
 */
export function buildUrlFromState(state: SidebarUIState): string {
  const params = new URLSearchParams();

  if (state.areaSidebarOpen) {
    params.set("sidebar", "areas");
  }

  if (state.selectedAreaSlug) {
    params.set("area", state.selectedAreaSlug);
  }

  if (state.toolsParam) {
    params.set("tools", state.toolsParam);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

/**
 * Push the canonical URL for the given UI state to the browser history.
 * Silently no-ops in server contexts.
 */
export function pushUrlFromState(state: SidebarUIState): void {
  if (typeof window === "undefined") return;
  const url = buildUrlFromState(state);
  window.history.pushState({}, "", url);
}

/**
 * Read the initial URL search params from `window.location` and return the
 * sidebar/area/tools values that should seed the store on first hydration.
 * Returns null in server contexts.
 */
export function readInitialUrlState(): SidebarUIState | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const sidebar = params.get("sidebar");
  const area = params.get("area");
  const tools = params.get("tools");

  return {
    areaSidebarOpen: sidebar === "areas" || Boolean(area),
    selectedAreaSlug: area ?? null,
    toolsParam: tools ?? null,
  };
}
