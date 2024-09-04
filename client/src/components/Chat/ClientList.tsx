/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

export default function ClientList({ onSearch, onTyping, query }: any) {
  const [showButton, setShowButton] = useState(false);

  return (
    <div className=" border rounded-lg bg-white border-gray-200 mr-4 overflow-y-auto">
      <h3 className="text-lg font-semibold p-4 border-b border-gray-200">
        Clients
      </h3>

      <div className="p-4 border-b border-gray-200">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={query}
            onChange={onTyping}
            onBlur={() => setShowButton(true)}
            onFocus={() => setShowButton(false)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {showButton && query && (
            <button
              onClick={onSearch}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          )}
        </div>
      </div>

      <ul className="divide-y divide-gray-200">
        {["Client 1", "Client 2", "Client 3"].map((client, index) => (
          <li
            key={index}
            className="p-4 hover:bg-gray-200 cursor-pointer transition duration-150 ease-in-out flex items-center"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white font-semibold border border-blue-600">
              {client.charAt(0)}
            </div>
            <span>{client}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
