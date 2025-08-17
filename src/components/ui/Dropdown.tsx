import { useEffect, useRef, useState, type ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);

    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
      <div className="relative" ref={ref}>
          <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">
              {trigger}
          </div>
          {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-100 bg-white shadow-lg p-1">
              {children}
          </div>
      )}
      </div>
  );
}