import { useRef, useState } from "react";
import type { MaskState, OtherKey } from "~type";
import Radio from "./Radio";
import { prefixKeyLabels, prefixKeys } from "~common/state";

const keyboardKeyList: { key: OtherKey; label: string }[] = [
  {
    key: "openKey",
    label: "开/关",
  },
  {
    key: "addKey",
    label: "亮度+",
  },
  {
    key: "reduceKey",
    label: "亮度-",
  },
  {
    key: "activateKey",
    label: "当前页",
  },
];

type KeyboardKeyPopProps = {
  prefixKeyStr: string;
  state: MaskState;
  setKeyboardKey: (
    k: MaskState["keyboardKey"],
    othKeys?: Partial<Record<OtherKey, string>>
  ) => void;
};

export default function KeyboardKeyPop({
  prefixKeyStr,
  state,
  setKeyboardKey,
}: KeyboardKeyPopProps) {
  const keyboardKey = state.keyboardKey;
  const [isPop, setIsPop] = useState(false);
  const [checkKey, setCheckKey] = useState<OtherKey | "">("");
  const inpRef = useRef<HTMLInputElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!checkKey) return;
    setKeyboardKey(
      {
        ...keyboardKey,
        [checkKey]: e.code,
      },
      { [checkKey]: e.key }
    );
  };

  const isAllPrefixKey = prefixKeys.every((k) => keyboardKey[k]);

  return (
    <>
      <div className="relative mt-4 px-4 text-xs flex justify-between">
        <div
          className={`text-gray-400 space-y-2 ${isAllPrefixKey ? "text-[10px]" : ""}`}
        >
          <div>
            <span className="inline-block w-10 font-medium">开/关:</span>
            {prefixKeyStr} {state.otherKeyLabel?.openKey?.toLocaleUpperCase()}
          </div>
          <div>
            <span className="inline-block w-10 font-medium">亮度:</span>
            {prefixKeyStr} {state.otherKeyLabel?.addKey?.toLocaleUpperCase()}/
            {state.otherKeyLabel?.reduceKey?.toLocaleUpperCase()}
          </div>
        </div>
        <div
          className="bg-indigo-500 text-white cursor-pointer rounded-full p-1 text-[10px] hover:bg-indigo-400"
          onClick={() => setIsPop(true)}
        >
          编<br />辑
        </div>
      </div>
      {isPop && (
        <div
          className="absolute left-0 top-0 w-full h-full bg-black/40 flex justify-center items-center"
          onClick={() => setIsPop(false)}
        >
          <div
            className="w-[90%] relative h-fit bg-[#1f1f1f] text-white p-2 py-4 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setCheckKey("");
            }}
          >
            <div
              className="absolute right-2 cursor-pointer top-0 text-xl hover:scale-110"
              onClick={() => setIsPop(false)}
            >
              ×
            </div>
            <div className="font-medium mb-2">快捷键前缀:</div>
            <div className="flex flex-wrap justify-between">
              {prefixKeys.map((k) => (
                <div
                  key={k}
                  className="flex items-center gap-x-0.5 text-[10px]"
                >
                  <Radio
                    checked={keyboardKey[k]}
                    onChange={(v) => setKeyboardKey({ ...keyboardKey, [k]: v })}
                  />
                  {prefixKeyLabels[k]}
                </div>
              ))}
            </div>
            <div className="font-medium mt-4 mb-2">
              配合按键
              <span className="text-[10px] text-gray-500">
                （点击修改项，按键即可修改）
              </span>
            </div>
            <div className="space-y-2">
              {keyboardKeyList.map((k) => (
                <div
                  key={k.key}
                  className="flex gap-x-1 items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCheckKey(k.key);
                    inpRef.current.focus();
                  }}
                >
                  <span className="inline-block w-10 font-medium text-xs">
                    {k.label}
                  </span>
                  <div
                    className={`py-1 flex-1 text-center rounded-sm border-b border-solid border-gray-100 hover:bg-zinc-800 ${checkKey === k.key ? "text-indigo-500 !border-indigo-500 bg-zinc-800" : ""}`}
                  >
                    {`${state.otherKeyLabel?.[k.key]?.toLocaleUpperCase()} (${keyboardKey[k.key]})`}
                  </div>
                </div>
              ))}
            </div>
            <input
              ref={inpRef}
              onKeyDown={onKeyDown}
              className="size-0 opacity-0 absolute right-0 bottom-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
