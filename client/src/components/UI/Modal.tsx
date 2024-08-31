import React, { ReactNode, useEffect, useState } from "react";
import { clsx } from "../../utils";

const sizes = {
  "3xl": "max-w-3xl",
  "2xl": "max-w-2xl",
  xl: "max-w-xl",
  lg: "max-w-lg",
  md: "max-w-md",
  sm: "max-w-sm",
  xs: "max-w-xs",
};
interface IProps {
  children: ReactNode;
  setState: React.Dispatch<boolean>;
  state: boolean;
  size?: keyof typeof sizes;
}

export default function Model({ state, setState, children, size }: IProps) {
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
      {backdrop && (
        <div
          className={clsx([
            "relative z-10 w-full max-h-screen overflow-y-auto p-3",
            sizes[size || "md"],
          ])}
        >
          {children}
        </div>
      )}
    </div>
  );
}
