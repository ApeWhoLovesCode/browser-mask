import "./style.css";
import { useStorage } from "@plasmohq/storage/hook";
import type { MaskState } from "~type";
import { MASK_STORAGE } from "~common/storageKey";
import { useEffect, useState } from "react";
import { isIncludesId, isTabActive, onChangeTabId } from "~utils/tab";
import { rangeOpacity } from "~utils/range";
import { getPlasmoShadowContainer } from "~utils/dom";

export default function Mask() {
  const [state, setState] = useStorage<MaskState>(MASK_STORAGE, {
    isOpen: false,
    tabIds: [],
    opacity: 40,
    curValid: false,
  });

  const [url, setUrl] = useState("");

  useEffect(() => {
    const hostUrl = window.location.host;
    setUrl(hostUrl);

    const onKeyDown = (e: KeyboardEvent) => {
      // e.metaKey: true 代表 Mac command
      const isCtrlAndShift = e.ctrlKey && e.shiftKey;
      if (!isCtrlAndShift) return;

      const changeOpacity = (v: number) => {
        setState((data) => {
          if (!data.isOpen) return data;
          data.opacity = rangeOpacity(data.opacity + v);
          return { ...data };
        });
      };

      if (e.key === "m" || e.key === "M") {
        setState((data) => {
          data.isOpen = !data.isOpen;
          if (data.isOpen) {
            onChangeTabId({
              isAdd: !data.curValid ? !data.isOpen : data.isOpen,
              tabIds: data.tabIds,
              url: hostUrl,
            });
          } else {
            data.tabIds = [];
          }
          return { ...data };
        });
      } else if (e.key === "c" || e.key === "C") {
        setState((data) => {
          onChangeTabId({
            isAdd: !isIncludesId(hostUrl, data.tabIds),
            tabIds: data.tabIds,
            url: hostUrl,
          });
          return { ...data };
        });
      } else if (e.key === "=" || e.key === "+") {
        changeOpacity(10);
      } else if (e.key === "-" || e.key === "_") {
        changeOpacity(-10);
      }
    };

    // 解决 mask fixed 无效的问题
    const plasmoShadowContainer = getPlasmoShadowContainer();
    plasmoShadowContainer.style.position = "fixed";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isOpen = state.isOpen && isTabActive(url, state);

  return (
    <>
      {isOpen && (
        <div
          className="browser-mask"
          style={{
            boxShadow: `55vmax 55vmax 0 55vmax rgba(0, 0, 0, ${state.opacity / 100})`,
          }}
        ></div>
      )}
    </>
  );
}
