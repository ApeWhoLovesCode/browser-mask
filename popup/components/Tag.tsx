import type { DivProps } from "../type";

export default function Tag({ className = "", children, ...props }: DivProps) {
  return (
    <span
      className={`text-[10px] inline-block ml-2 text-nowrap bg-indigo-900 text-white rounded px-1.5 py-0.5 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
