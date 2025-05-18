import "./style.css";
import { useStorage } from "@plasmohq/storage/hook";
import type { MaskState } from "~type";
import { MASK_STORAGE } from "~common/storageKey";
import { useEffect, useRef, useState } from "react";
import { isIncludesId, isTabActive, onChangeTabId } from "~utils/tab";
import { rangeOpacity } from "~utils/range";
import { getOnePlasmoShadowContainer, getPlasmoShadowContainer } from "~utils/dom";
import { getDefaultState, MASK_ID, prefixKeys } from "~common/state";

export default function Mask() {
  const [state, setState] = useStorage<MaskState>(
    MASK_STORAGE,
    getDefaultState()
  );
  const keyboardKey = useRef<MaskState["keyboardKey"]>();
  keyboardKey.current = state.keyboardKey;

  const [url, setUrl] = useState("");

  useEffect(() => {
    const hostUrl = window.location.host;
    setUrl(hostUrl);

    const onKeyDown = (e: KeyboardEvent) => {
      const keyArr = prefixKeys.filter((k) => keyboardKey.current[k]);
      if (keyArr.some((k) => !e[k])) return;

      const changeOpacity = (v: number) => {
        setState((data) => {
          if (!data.isOpen) return data;
          data.opacity = rangeOpacity(data.opacity + v);
          return { ...data };
        });
      };

      if (e.code === keyboardKey.current.openKey) {
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
      } else if (e.code === keyboardKey.current.activateKey) {
        setState((data) => {
          onChangeTabId({
            isAdd: !isIncludesId(hostUrl, data.tabIds),
            tabIds: data.tabIds,
            url: hostUrl,
          });
          return { ...data };
        });
      } else if (e.code === keyboardKey.current.addKey) {
        changeOpacity(10);
      } else if (e.code === keyboardKey.current.reduceKey) {
        changeOpacity(-10);
      }
    };

    // 解决 mask fixed 无效的问题
    // const plasmoShadowContainer = getPlasmoShadowContainer(MASK_ID);
    const plasmoShadowContainer = getOnePlasmoShadowContainer();
    if(plasmoShadowContainer) {
      plasmoShadowContainer.style.position = "fixed";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isOpen = state.isOpen && isTabActive(url, state);

  return (
    <div id={MASK_ID}>
      {isOpen && (
        <div
          style={{
            boxShadow: `55vmax 55vmax 0 55vmax rgba(0, 0, 0, ${state.opacity / 100})`,
          }}
        ></div>
      )}
    </div>
  );
}
