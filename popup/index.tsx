import { useStorage } from "@plasmohq/storage/hook";
import "./style.css";
import { MASK_STORAGE } from "~common/storageKey";
import type { MaskState } from "~type";
import { getActiveTab, isIncludesId, onChangeTabId } from "~utils/tab";
import { useEffect, useState } from "react";
import { getHostFromUrl } from "~utils/url";
import React from "react";
import { rangeOpacity } from "~utils/range";
import { getDefaultState, prefixKeyLabels, prefixKeys } from "~common/state";
import Tag from "./components/Tag";
import Button from "./components/Button";
import KeyboardKeyPop from "./components/KeyboardKeyPop";
import Radio from "./components/Radio";

const defaultState = getDefaultState();

function IndexPopup() {
  const [state, setState] = useStorage<MaskState>(MASK_STORAGE, defaultState);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");

  const isTabIncludes = isIncludesId(url, state.tabIds);
  const isUrlActive = !state.curValid ? !isTabIncludes : isTabIncludes;

  useEffect(() => {
    getActiveTab().then((tab) => {
      setUrl(getHostFromUrl(tab.url));
    });
  }, []);

  const onMouseDown = (event: MouseEvent) => {
    const progressW = progressRef.current.clientWidth;
    const progressL = progressRef.current.offsetLeft;
    const startOpacity = rangeOpacity(
      ((event.clientX - progressL) * 100) / progressW
    );
    const startX = event.clientX;
    setState({ ...state, opacity: startOpacity });

    let timer = null;
    function move(e: MouseEvent) {
      if (timer) return;
      const changeX = e.clientX - startX;
      const _opacity = rangeOpacity(startOpacity + (changeX * 100) / progressW);
      setState({ ...state, opacity: _opacity });
      timer = setTimeout(() => {
        timer = null;
      }, 60);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", move);
    });
  };

  const onChangeTabIdFn = (isAdd: boolean) => {
    onChangeTabId({ isAdd, tabIds: state.tabIds, url });
  };

  const prefixKeyStr = prefixKeys.reduce((pre, key) => {
    return pre + (state.keyboardKey[key] ? `${prefixKeyLabels[key]} ` : "");
  }, "");

  return (
    <div className="py-3 bg-black w-60">
      <div
        className="px-2 mb-2 flex items-center gap-x-2 cursor-pointer group"
        onClick={() => setState({ ...state, curValid: !state.curValid })}
      >
        <Radio checked={!state.curValid} />
        <div className="flex-1 text-[10px] text-gray-400 group-hover:text-gray-300/85">
          默认打开遮罩后所有网站都将启用，关闭后需手动激活的网站才有遮罩（取反）。
        </div>
      </div>
      <div
        className={`${!isUrlActive ? " line-through" : ""} text-xs mx-2 p-2 mb-4 rounded-sm text-gray-400 border-b border-indigo-500 border-solid hover:bg-gray-800 cursor-pointer`}
        onClick={() => {
          onChangeTabIdFn(!isTabIncludes);
          setState({ ...state });
        }}
      >
        <div className="flex items-center">
          当前网站 ({isUrlActive ? "激活" : "未激活"})
          <div className="flex-1 w-0">
            <Tag className="max-w-full truncate">
              {prefixKeyStr}{" "}
              {state.otherKeyLabel?.activateKey?.toLocaleUpperCase()}
            </Tag>
          </div>
        </div>
        <div className="truncate">{url}</div>
      </div>
      <div className="flex items-center gap-x-3 px-4">
        <Button
          className="rounded-full !size-6 !p-0"
          onClick={() => setState({ ...state, opacity: state.opacity - 10 })}
        >
          -
        </Button>
        <div
          ref={progressRef}
          onMouseDown={onMouseDown as any}
          className="relative flex-1 w-0 h-6 cursor-pointer rounded-sm overflow-hidden"
        >
          <progress
            color="#3b70e8"
            className="progress w-full h-6 m-0"
            value={state.opacity}
            max="100"
          ></progress>
          <div className="absolute left-1/2 top-1/2 select-none -translate-x-1/2 -translate-y-1/2 text-indigo-600 text-medium font-bold">
            {state.opacity}%
          </div>
        </div>
        <Button
          className="rounded-full !size-6 !p-0"
          onClick={() => setState({ ...state, opacity: state.opacity + 10 })}
        >
          +
        </Button>
      </div>
      <div className="px-4 mt-4 mx-4 flex justify-between">
        <div className="relative">
          <Button
            onClick={async () => {
              const isOpen = !state.isOpen;
              onChangeTabIdFn(isOpen ? state.curValid : !state.curValid);
              setState({ ...state, isOpen });
            }}
          >
            {state.isOpen ? "关闭" : "打开"}
          </Button>
        </div>
        <Button
          onClick={() => {
            setState({ ...defaultState });
          }}
        >
          重置
        </Button>
      </div>
      <KeyboardKeyPop
        state={state}
        setKeyboardKey={(keys, othKeys) =>
          setState((state) => {
            const d = {
              ...state,
              keyboardKey: keys,
            };
            if (othKeys) {
              d.otherKeyLabel = { ...state.otherKeyLabel, ...othKeys };
            }
            return d;
          })
        }
        prefixKeyStr={prefixKeyStr}
      />
    </div>
  );
}

export default IndexPopup;
