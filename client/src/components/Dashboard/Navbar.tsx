import { useState } from "react";
import ELink from "../Extended/Link";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="flex flex-col  h-full justify-between">
      <div>
        <div className="w-full relative">
          <a className="inline-flex w-[220px] mb-8 rounded-[30px] px-6 overflow-hidden">
            <img
              src="/icons/hlogo.png"
              alt="logo"
              className="w-full h-full object-cover"
            />
          </a>
          <span className="absolute right-9 bg-amber-200 py-1 rounded-md tracking-wider font-medium uppercase text-xs text-amber-900 px-4">
            Beta
          </span>
        </div>
        <div className="px-3">
          <ul className="flex flex-col gap-2">
            <li>
              <ELink to="/dashboard" className="dashboard__nav_item">
                <span className="material-symbols-outlined -mt-[2px]">
                  team_dashboard
                </span>
                Dashboard
              </ELink>
            </li>
            <li className="px-4 uppercase text-xs text-gray-400 mt-6 font-semibold">
              Work Office
            </li>
            <li>
              <ELink
                to={"/dashboard/contracts"}
                className="dashboard__nav_item"
              >
                <span className="material-symbols-outlined -mt-[2px]">
                  ballot
                </span>
                Contracts
              </ELink>
            </li>
            <li>
              <ELink to={"/dashboard/invoices"} className="dashboard__nav_item">
                <span className="material-symbols-outlined -mt-[2px]">
                  paid
                </span>
                Invoices
              </ELink>
            </li>
            <li>
              <ELink to={"/dashboard/chats"} className="dashboard__nav_item">
                <span className="material-symbols-outlined -mt-[2px]">
                  conversion_path
                </span>
                Chats
              </ELink>
            </li>
            <li>
              <ELink to={"/dashboard/employee"} className="dashboard__nav_item">
                <span className="material-symbols-outlined -mt-[2px]">
                  person_apron
                </span>
                Employee
              </ELink>
            </li>
            <li className="px-4 uppercase text-xs text-gray-400 mt-6 font-semibold">
              Help Center
            </li>
            <li>
              <ELink to={"/dashboard/support"} className="dashboard__nav_item">
                <span className="material-symbols-outlined -mt-[2px]">
                  contact_support
                </span>
                Support
              </ELink>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-50/80 px-6 -mx-4 cursor-pointer py-5 border-t">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3">
            <div>
              <div className="w-[40px] rounded-md bg-purple-100 font-bold text-purple-900 flex items-center justify-center aspect-square">
                GO
              </div>
            </div>
            <div>
              <div className="font-semibold">Godwin</div>
              <p className="text-xs text-gray-500">Contractor</p>
            </div>
          </div>
          <button onClick={() => setShowDropdown((e) => !e)}>
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        {showDropdown && (
          <div className="mt-5">
            <ul>
              <li>
                <ELink
                  to={"/dashboard/settings"}
                  className="dashboard__nav_item"
                >
                  <span className="material-symbols-outlined -mt-[2px]">
                    manage_accounts
                  </span>
                  Settings
                </ELink>
              </li>
              <li>
                <button
                  onClick={() => (location.href = "/")}
                  className="dashboard__nav_item hover:!bg-red-200 hover:!text-red-900 !text-red-600 w-full"
                >
                  <span className="material-symbols-outlined -mt-[2px]">
                    move_item
                  </span>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
