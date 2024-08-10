export type MaskState = {
  /** 网页id */
  tabIds: string[];
  /** 是否打开 */
  isOpen: boolean;
  /** 不透明度 */
  opacity: number;
  /** 是否当前网页有效 */
  curValid: boolean;
  /** 键盘快捷键 */
  keyboardKey: {
    ctrlKey?: boolean;
    /**
     * @default true
     */
    altKey?: boolean;
    shiftKey?: boolean;
    /** true 代表 Mac command*/
    metaKey?: boolean;
    /** @default: "m" */
    openKey: string;
    /** @default: "+" */
    addKey: string;
    /** @default: "-" */
    reduceKey: string;
    /** @default: "c" */
    activateKey: string;
  };
};
