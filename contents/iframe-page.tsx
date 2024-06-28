import cssText from "data-text:~/contents/style.css";
import "./style.css";
import { useEffect, useRef, useState } from "react";
import { defaultIframePageState, defaultMaskState } from "~common/defaultState";
import { useStorage } from "@plasmohq/storage/hook";
import type { IframePageState, MaskState } from "~type";
import { IFRAME_PAGE_STORAGE, MASK_STORAGE } from "~common/storageKey";
import { isIncludesId } from "~utils/tab";

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export default () => <></>;

// export default function IFramePage() {
function IFramePage() {
  const [maskState] = useStorage<MaskState>(MASK_STORAGE);
  const [state, setState] = useStorage<IframePageState>(
    IFRAME_PAGE_STORAGE,
    defaultIframePageState
  );
  const [url, setUrl] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const hostUrl = window.location.host;
    setUrl(hostUrl);
  }, []);

  const isOpen = state.isOpen && isIncludesId(url, maskState?.tabIds);
  console.log("isOpen: ", isOpen);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const iframeDocument =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;
        console.log("iframeDocument: ", iframeDocument);
        var styleElement = document.createElement("style");
        if (iframeDocument) {
          styleElement.textContent = "body { background-color: blue; }"; // 修改为你想要的CSS规则
          iframeDocument.head.appendChild(styleElement);
        }
        const b = iframeRef.current.querySelector("body");
        console.log("b: ", b);
        if (b) {
          b.style.backgroundColor = "green";
        }
      }, 2000);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: state.y,
            left: state.x,
          }}
        >
          <iframe
            ref={iframeRef}
            src={state.url}
            style={{ width: state.w, height: state.h }}
          />
        </div>
      )}
    </>
  );
}
