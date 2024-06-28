import type { IframePageState, MaskState } from "~type";

export const INIT_OPACITY = 40;

export const defaultMaskState: MaskState = {
  isOpen: false,
  tabIds: [],
  opacity: INIT_OPACITY,
};

export const defaultIframePageState: IframePageState = {
  isOpen: false,
  opacity: 100,
  url: "",
  x: 0,
  y: 0,
  w: 200,
  h: 200,
};
