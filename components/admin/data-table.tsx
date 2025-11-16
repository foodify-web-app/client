'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  searchable = true,
  searchKeys = [],
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = searchable
    ? data.filter((item) =>
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-foreground-secondary dark:text-dark-foreground-secondary" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-white/10 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto dark:bg-zinc-800 dark:text-white card-base"
      >
        <table className="w-full">
          <thead className="border-b border-border dark:border-white/10">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-6 py-4 text-left text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-border dark:border-white/10 ${
                  onRowClick ? 'cursor-pointer hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-4 text-sm">
                    {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
            Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
