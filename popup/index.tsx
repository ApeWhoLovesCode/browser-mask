import { useStorage } from "@plasmohq/storage/hook";
import "./style.css";
import { MASK_STORAGE } from "~common/storageKey";
import type { MaskState } from "~type";
import { getActiveTab, isIncludesId, onChangeTabId } from "~utils/tab";
import { useEffect, useState } from "react";
import { getHostFromUrl } from "~utils/url";
import React from "react";
import { rangeOpacity } from "~utils/range";

const INIT_OPACITY = 40;

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

function Tag({ className = "", children, ...props }: DivProps) {
  return (
    <span
      className={`text-[10px] inline-block ml-2 text-nowrap bg-indigo-900 text-white rounded px-1.5 py-0.5 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

function Button({ className = "", children, ...props }: DivProps) {
  return (
    <div
      className={`font-medium px-3 text-nowrap py-1 rounded flex justify-center items-center h-fit transition-all text-gray-300 bg-zinc-600 hover:bg-zinc-500 hover:text-gray-200 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function IndexPopup() {
  const [state, setState] = useStorage<MaskState>(MASK_STORAGE, {
    isOpen: false,
    tabIds: [],
    opacity: INIT_OPACITY,
    curValid: false,
  });
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

  return (
    <div className="py-3 bg-black w-60">
      <div
        className="px-2 mb-2 flex items-center gap-x-2 cursor-pointer group"
        onClick={() => setState({ ...state, curValid: !state.curValid })}
      >
        <div className="size-4 rounded-full flex justify-center items-center border border-indigo-500 border-solid group-hover:border-indigo-400">
          {!state.curValid && (
            <div className="size-2.5 bg-indigo-500 rounded-full"></div>
          )}
        </div>
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
        <div>
          当前网站 ({isUrlActive ? "激活" : "未激活"})
          <Tag>Ctrl + Shift + C</Tag>
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
      {/* <div className="mt-2 flex items-center justify-center">
        <Tag>Ctrl + Shift + +/-</Tag>
      </div> */}
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
          {/* <Tag className="absolute -bottom-2 left-1/2 -translate-x-[60%] translate-y-full">
            Ctrl + Shift + M
          </Tag> */}
        </div>
        <Button
          onClick={() =>
            setState({ ...state, opacity: INIT_OPACITY, tabIds: [] })
          }
        >
          重置
        </Button>
      </div>
      <div className="mt-4 px-4 text-xs text-gray-400 space-y-2">
        <div>
          <span className="inline-block w-10 font-medium">开/关:</span>
          Ctrl Shift M
        </div>
        <div>
          <span className="inline-block w-10 font-medium">亮度:</span>
          Ctrl Shift +/-
        </div>
      </div>
    </div>
  );
}

export default IndexPopup;
