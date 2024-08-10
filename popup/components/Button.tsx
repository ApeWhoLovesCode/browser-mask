import { DivProps } from "../type";

export default function Button({
  className = "",
  children,
  ...props
}: DivProps) {
  return (
    <div
      className={`font-medium px-3 text-nowrap py-1 rounded flex justify-center items-center h-fit transition-all text-gray-300 bg-zinc-600 hover:bg-zinc-500 hover:text-gray-200 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
