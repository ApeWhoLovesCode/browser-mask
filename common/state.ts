import type { MaskState, RadioKey } from "~type";

export const MASK_ID = "lhh-browser-mask";

export const INIT_OPACITY = 40;

export const getDefaultState = (): MaskState => ({
  tabIds: [],
  isOpen: false,
  opacity: INIT_OPACITY,
  curValid: false,
  keyboardKey: {
    altKey: true,
    shiftKey: true,
    openKey: "KeyM",
    addKey: "Equal",
    reduceKey: "Minus",
    activateKey: "KeyC",
  },
  otherKeyLabel: {
    openKey: "m",
    addKey: "+",
    reduceKey: "-",
    activateKey: "c",
  },
});

export const prefixKeys: RadioKey[] = [
  "altKey",
  "shiftKey",
  "ctrlKey",
  "metaKey",
];

export const prefixKeyLabels: Partial<Record<RadioKey, string>> = {
  altKey: "Alt",
  shiftKey: "Shift",
  ctrlKey: "Ctrl",
  metaKey: "Command",
};
