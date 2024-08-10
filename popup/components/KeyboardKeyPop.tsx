import Button from "./Button";
import type { MaskState } from "~type";

export default function KeyboardKeyPop({
  prefixKeyStr,
  keyboardKey,
}: {
  prefixKeyStr: string;
  keyboardKey: MaskState["keyboardKey"];
}) {
  return (
    <>
      <div className="mt-4 px-4 text-xs text-gray-400 space-y-2">
        <div>
          <span className="inline-block w-10 font-medium">开/关:</span>
          {prefixKeyStr} {keyboardKey.openKey?.toLocaleUpperCase()}
        </div>
        <div>
          <span className="inline-block w-10 font-medium">亮度:</span>
          {prefixKeyStr} {keyboardKey.addKey?.toLocaleUpperCase()}/
          {keyboardKey.reduceKey?.toLocaleUpperCase()}
        </div>
      </div>
      <Button>编辑快捷键</Button>
      <div className="absolute left-0 top-0 w-full h-full bg-black/30 flex justify-center items-center">
        <div className="w-3/4 h-3/4 bg-[#0a0e12]">
          <div className="w-20 font-medium">快捷键前缀:</div>
          <input type="text" />
        </div>
      </div>
    </>
  );
}
