import type { MaskState } from "~type";

export async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

export function isIncludesId(id: string, tabIds: string[]) {
  return tabIds?.some((tabId) => tabId.includes(id));
}

export function isTabActive(id: string, state: MaskState) {
  return !state.curValid
    ? !isIncludesId(id, state.tabIds)
    : isIncludesId(id, state.tabIds);
}
