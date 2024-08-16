export default function Radio({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div
      className="size-4 rounded-full flex justify-center items-center cursor-pointer border border-indigo-500 border-solid group-hover:border-indigo-400"
      onClick={() => onChange(!checked)}
    >
      {checked && <div className="size-2.5 bg-indigo-500 rounded-full"></div>}
    </div>
  );
}
