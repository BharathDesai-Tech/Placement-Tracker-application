import React, { useState } from 'react';
import { type StudentProfile, type Branch } from '../types/placement.ts';

interface StudentProfileBarProps {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
}

const ALL_BRANCHES: Branch[] = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const StudentProfileBar: React.FC<StudentProfileBarProps> = ({
  student,
  onUpdateStudent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [branch, setBranch] = useState<Branch>(student.branch);
  const [cgpa, setCgpa] = useState(student.cgpa.toString());
  const [backlogs, setBacklogs] = useState(student.backlogs.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCgpa = parseFloat(cgpa);
    const parsedBacklogs = parseInt(backlogs, 10);

    onUpdateStudent({
      ...student,
      name: name.trim() || student.name,
      branch,
      cgpa: isNaN(parsedCgpa) ? student.cgpa : Math.min(10, Math.max(0, parsedCgpa)),
      backlogs: isNaN(parsedBacklogs) ? student.backlogs : Math.max(0, parsedBacklogs),
    });
    setIsEditing(false);
  };

  return (
    <section 
      aria-label="Student Academic Profile"
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Avatar & Basic Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-base shadow-xs shrink-0">
            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ST'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Active Candidate Profile
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-500">{student.rollNumber}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {student.name}
            </h2>
          </div>
        </div>

        {/* Center: Profile Key Metrics Pills (Branch, CGPA, Backlogs) */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          
          {/* Branch Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block leading-tight">Branch</span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px] sm:max-w-[210px] block">
                {student.branch}
              </span>
            </div>
          </div>

          {/* CGPA Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-[10px] uppercase font-semibold text-emerald-700 block leading-tight">CGPA</span>
              <span className="font-bold text-sm text-emerald-950">{student.cgpa.toFixed(1)} / 10.0</span>
            </div>
          </div>

          {/* Backlogs Pill */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
            student.backlogs === 0
              ? 'bg-sky-50/70 border-sky-100 text-sky-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <svg className={`w-4 h-4 shrink-0 ${student.backlogs === 0 ? 'text-sky-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className={`text-[10px] uppercase font-semibold block leading-tight ${student.backlogs === 0 ? 'text-sky-700' : 'text-amber-700'}`}>
                Backlogs
              </span>
              <span className="font-bold text-xs">
                {student.backlogs === 0 ? '0 Backlogs' : `${student.backlogs} Active`}
              </span>
            </div>
          </div>

          {/* Quick Edit Profile Trigger */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Edit student profile to test eligibility checks with different CGPA or branch"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

        </div>
      </div>

      {/* Expandable Quick Edit Panel to easily test different CGPA / branch combinations */}
      {isEditing && (
        <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Update Student Academic Profile (Test Real-Time Eligibility)
            </span>
            <span className="text-[11px] text-slate-500">
              Changes instantly re-evaluate job eligibility criteria
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label htmlFor="student-name-input" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Full Name
              </label>
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                placeholder="Student Name"
                required
              />
            </div>

            <div>
              <label htmlFor="student-branch-select" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Branch / Specialization
              </label>
              <select
                id="student-branch-select"
                value={branch}
                onChange={e => setBranch(e.target.value as Branch)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {ALL_BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="student-cgpa-input" className="block text-[11px] font-semibold text-slate-600 mb-1">
                CGPA (Scale 0 - 10)
              </label>
              <input
                id="student-cgpa-input"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={cgpa}
                onChange={e => setCgpa(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="student-backlogs-input" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Active Backlogs
              </label>
              <input
                id="student-backlogs-input"
                type="number"
                min="0"
                max="10"
                value={backlogs}
                onChange={e => setBacklogs(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              Save & Re-evaluate
            </button>
          </div>
        </form>
      )}

    </section>
  );
};
