import React from 'react';
import { type UserRole, toggleRole } from '../utils/mode.ts';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  studentName?: string;
  studentBranch?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentRole, 
  onRoleChange,
  studentName = 'Alex Rivera',
  studentBranch = 'B.Tech CS • 2026',
}) => {
  const isOfficer = currentRole === 'officer';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Portal Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-sm shrink-0">
              {/* Graduation Cap / Building SVG */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">PlacementHub</span>
                <span className={`hidden md:inline-flex text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                  isOfficer 
                    ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                    : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  {isOfficer ? 'Officer Desk' : 'Student Portal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Campus Placement & Career Tracker</p>
            </div>
          </div>

          {/* Center / Right: Mode Toggle Switch */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            
            {/* Dual Mode Toggle Segmented Control */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner">
              {/* Student Mode Button */}
              <button
                type="button"
                onClick={() => onRoleChange('student')}
                aria-pressed={!isOfficer}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  !isOfficer
                    ? 'bg-white text-indigo-700 shadow-sm font-bold border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${!isOfficer ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Student</span>
              </button>

              {/* Placement Officer Mode Button */}
              <button
                type="button"
                onClick={() => onRoleChange('officer')}
                aria-pressed={isOfficer}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  isOfficer
                    ? 'bg-white text-purple-700 shadow-sm font-bold border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isOfficer ? 'text-purple-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span><span className="hidden sm:inline">Placement </span>Officer</span>
              </button>
            </div>

            {/* Quick Toggle Switch Pill for fast flipping */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                role="switch"
                aria-checked={isOfficer}
                aria-label="Toggle Student and Placement Officer modes"
                onClick={() => onRoleChange(toggleRole(currentRole))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isOfficer ? 'bg-purple-600' : 'bg-indigo-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                    isOfficer ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                isOfficer
                  ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200'
                  : 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200'
              }`}>
                {isOfficer ? 'PO' : studentName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ST'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {isOfficer ? 'Dr. Vance Miller' : studentName}
                </p>
                <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                  {isOfficer ? 'Head Placement Officer' : studentBranch}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
