import React from 'react';

interface JobFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  branchFilter: string;
  onBranchFilterChange: (b: string) => void;
  eligibilityFilter: 'all' | 'eligible' | 'not-eligible';
  onEligibilityFilterChange: (e: 'all' | 'eligible' | 'not-eligible') => void;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

const BRANCH_OPTIONS = [
  { value: 'all', label: 'All Branches' },
  { value: 'Computer Science & Engineering', label: 'Computer Science (CSE)' },
  { value: 'Information Technology', label: 'Information Technology (IT)' },
  { value: 'Electronics & Communication', label: 'Electronics & Comm (ECE)' },
  { value: 'Electrical & Electronics', label: 'Electrical & Electronics (EEE)' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: 'Civil Engineering', label: 'Civil Engineering' },
];

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchFilterChange,
  eligibilityFilter,
  onEligibilityFilterChange,
  totalCount,
  filteredCount,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery !== '' || branchFilter !== 'all' || eligibilityFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
      
      {/* Top Filter Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Search Bar Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search company, job role, package, or location..."
            className="w-full text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          
          {/* Branch Filter Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="filter-branch-select" className="sr-only">Filter by Branch</label>
            <select
              id="filter-branch-select"
              value={branchFilter}
              onChange={e => onBranchFilterChange(e.target.value)}
              className="w-full sm:w-auto text-xs px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            >
              {BRANCH_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Eligibility Filter Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="filter-eligibility-select" className="sr-only">Filter by Eligibility</label>
            <select
              id="filter-eligibility-select"
              value={eligibilityFilter}
              onChange={e => onEligibilityFilterChange(e.target.value as 'all' | 'eligible' | 'not-eligible')}
              className="w-full sm:w-auto text-xs px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            >
              <option value="all">All Eligibility</option>
              <option value="eligible">Eligible Only ✓</option>
              <option value="not-eligible">Not Eligible Only ✕</option>
            </select>
          </div>

          {/* Clear Filters Button if any applied */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0"
            >
              Reset
            </button>
          )}

        </div>

      </div>

      {/* Filter Status Summary Tag */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div>
          <span>Showing </span>
          <strong className="text-slate-800">{filteredCount}</strong>
          <span> of {totalCount} drives</span>
          {hasActiveFilters && (
            <span className="text-indigo-600 font-medium ml-1.5">(Filtered)</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Eligible for you</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Criteria not met</span>
          </span>
        </div>
      </div>

    </div>
  );
};
