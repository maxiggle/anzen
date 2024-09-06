import clsx from "clsx";
import React, { useMemo, useState } from "react";

interface DataTableProps {
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

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data based on selected column
  const sortedData = useMemo(() => {
    if (sortColumn === null) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn] || "";
      const bVal = b[sortColumn] || "";
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
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
          {label && <h3 className="text-2xl font-semibold">{label}</h3>}
          <div className="flex flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="p-2 border border-gray-300 rounded"
            />
            {left && <div>{left}</div>}
          </div>
        </div>
      )}

      <table className="w-full rounded-md">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => handleSort(header)}
                className={clsx([
                  index === 0 && "rounded-tl-md",
                  index === headers.length - 1 && "rounded-tr-md",
                  "py-3 cursor-pointer font-semibold",
                ])}
              >
                {header}
                {sortColumn === header && (
                  <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={clsx([
                      "text-center py-3 text-gray-700 bg-white",
                      rowIndex + 1 === sortedData.length &&
                        cellIndex + 1 === headers.length &&
                        "rounded-br-md",
                      rowIndex + 1 === sortedData.length &&
                        cellIndex === 0 &&
                        "rounded-bl-md",
                    ])}
                  >
                    {typeof row[header] === "object" && row[header].type
                      ? row[header] // Handle React elements like contract content
                      : row[header] || "N/A"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
