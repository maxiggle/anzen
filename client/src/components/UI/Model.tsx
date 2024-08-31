import React, { ReactNode, useEffect, useState } from "react";
import { clsx } from "../../utils";

interface IProps {
  children: ReactNode;
  setState: React.Dispatch<boolean>;
  state: boolean;
}
export default function Model({ state, setState, children }: IProps) {
  const [backdrop, setBackdrop] = useState(state);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBackdrop(state);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [state]);

  return (
    <div
      className={clsx([
        "fixed inset-0 transition-all flex items-center justify-center",
        state ? "z-[1000] " : "-z-[1000]",
      ])}
    >
      {state && (
        <div
          onClick={() => setState(false)}
          className="backdrop-blur absolute inset-0 bg-black bg-opacity-10"
        />
      )}
      {backdrop && <div className="relative z-10">{children}</div>}
    </div>
  );
}
