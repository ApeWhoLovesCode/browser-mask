import { MaskState } from "~type";

export const INIT_OPACITY = 40;

export const getDefaultState = (): MaskState => ({
  tabIds: [],
  isOpen: false,
  opacity: INIT_OPACITY,
  curValid: false,
  keyboardKey: {
    altKey: true,
    shiftKey: true,
    openKey: "m",
    addKey: "+",
    reduceKey: "-",
    activateKey: "c",
  },
});

export const prefixKeys: (keyof MaskState["keyboardKey"])[] = [
  "altKey",
  "shiftKey",
  "ctrlKey",
  "metaKey",
];

export const prefixKeyLabels: Partial<
  Record<keyof MaskState["keyboardKey"], string>
> = {
  altKey: "Alt",
  shiftKey: "Shift",
  ctrlKey: "Ctrl",
  metaKey: "Mac",
};
