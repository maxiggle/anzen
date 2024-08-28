import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface IProps {
  children: ReactNode;
}
export default function Dashboard({ children }: IProps) {
  return (
    <div className="flex flex-row h-screen w-full">
      <div className="max-w-[300px] w-full bg-[#fcf3d3]">
        <div className="py-12 px-3 w-full">
          <h1 className="text-2xl font-bold px-3 italic">MyHR</h1>
        </div>
        <div className="px-3">
          <ul>
            <li>
              <Link
                to={"/"}
                className="flex flex-row hover:bg-amber-200 rounded uppercase text-sm tracking-wider active:bg-amber-300 py-3 px-4 gap-2 items-center"
              >
                <span className="material-symbols-outlined -mt-1">home</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={"/contracts"}
                className="flex flex-row hover:bg-amber-200 uppercase text-sm rounded active:bg-amber-300 tracking-wider py-3 px-4 gap-2 items-center"
              >
                <span className="material-symbols-outlined">contract</span>
                Contracts
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full bg-white">{children}</div>
    </div>
  );
}
