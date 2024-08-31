import React, { useState, useMemo } from "react";
import { clsx } from "../../utils";

interface DataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  headers: string[];
  label?: string;
  left?: React.ReactNode;
  showInput?: boolean;
}

export default function DataTable({
  data,
  headers,
  label,
  left,
  showInput = false,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (sortColumn === null) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div>
      {showInput && (
        <div className="flex flex-row mb-3 justify-between items-center">
          <div>
            {label && (
              <label className="block mb-1 text-left text-2xl font-semibold font-orbitron">
                {label}
              </label>
            )}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="p-2 border border-purple-300 rounded"
              />
            </div>
            <div>{left}</div>
          </div>
        </div>
      )}
      <table className="w-full rounded-md">
        <thead className="bg-purple-200 rounded-md">
          <tr className="py-2">
            {headers.map((header, index) => (
              <th
                className={clsx([
                  index === 0 && "rounded-tl-md",
                  index === headers.length - 1 && "rounded-tr-md",
                  "py-3 cursor-pointer !font-semibold",
                ])}
                key={index}
                onClick={() => handleSort(header.toLowerCase())}
              >
                {header}
                {sortColumn === header.toLowerCase() && (
                  <span>{sortDirection === "asc" ? "▲" : " ▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers
                .map((e) => e.toLowerCase())
                .map((header, cellIndex) => (
                  <td
                    className={clsx([
                      "text-center py-3 text-gray-700 bg-white",
                      rowIndex + 1 === sortedData.length &&
                        cellIndex + 1 === headers.length &&
                        "rounded-br-md",
                      rowIndex + 1 === sortedData.length &&
                        cellIndex === 0 &&
                        "rounded-bl-md",
                    ])}
                    key={cellIndex}
                  >
                    {row[header]}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
