import React, { useState } from 'react';
import { type Job } from '../types/placement.ts';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Job) => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [ctcPackage, setCtcPackage] = useState('');
  const [eligibleBranch, setEligibleBranch] = useState('Computer Science & Engineering, Information Technology');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [deadlineDate, setDeadlineDate] = useState('2026-11-30');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim() || !ctcPackage.trim()) return;

    const initials = companyName
      .trim()
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CP';

    const numericCtc = parseFloat(ctcPackage.replace(/[^0-9.]/g, '')) || 10;
    const branches = eligibleBranch.split(',').map(b => b.trim()).filter(Boolean);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      companyName: companyName.trim(),
      companyLogoText: initials,
      role: role.trim(),
      ctcPackage: ctcPackage.trim(),
      numericCtc,
      eligibleBranches: branches.length > 0 ? branches : ['All Branches'],
      minCgpa: parseFloat(minCgpa) || 6.0,
      maxBacklogs: parseInt(maxBacklogs, 10) || 0,
      deadlineDate: deadlineDate || '2026-11-30',
      location: location.trim() || 'On-Campus',
      jobType: 'Full-Time',
      description: description.trim() || 'On-campus recruitment drive for 2026 batch candidates.',
      appliedCount: 0,
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-job-title"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 id="add-job-title" className="text-lg font-bold text-slate-900">
              Post New Placement Drive
            </h2>
            <p className="text-xs text-slate-500">
              Listing will be saved to localStorage and accessible to students.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="company-name-input" className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                id="company-name-input"
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Oracle"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="job-role-input" className="block font-semibold text-slate-700 mb-1">Job Role Title</label>
              <input
                id="job-role-input"
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. SDE-1, Cloud Engineer"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="ctc-package-input" className="block font-semibold text-slate-700 mb-1">CTC Package</label>
              <input
                id="ctc-package-input"
                type="text"
                required
                value={ctcPackage}
                onChange={e => setCtcPackage(e.target.value)}
                placeholder="e.g. $18 LPA"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="min-cgpa-input" className="block font-semibold text-slate-700 mb-1">Min CGPA</label>
              <input
                id="min-cgpa-input"
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={minCgpa}
                onChange={e => setMinCgpa(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="max-backlogs-input" className="block font-semibold text-slate-700 mb-1">Max Backlogs</label>
              <input
                id="max-backlogs-input"
                type="number"
                min="0"
                value={maxBacklogs}
                onChange={e => setMaxBacklogs(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="eligible-branch-input" className="block font-semibold text-slate-700 mb-1">
              Eligible Branches (comma separated, or All Branches)
            </label>
            <input
              id="eligible-branch-input"
              type="text"
              required
              value={eligibleBranch}
              onChange={e => setEligibleBranch(e.target.value)}
              placeholder="Computer Science & Engineering, Information Technology"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="deadline-date-input" className="block font-semibold text-slate-700 mb-1">Deadline Date</label>
              <input
                id="deadline-date-input"
                type="date"
                required
                value={deadlineDate}
                onChange={e => setDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="location-input" className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX / Remote"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description-input" className="block font-semibold text-slate-700 mb-1">Job Description</label>
            <textarea
              id="description-input"
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of the role and recruitment process..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
            >
              Publish Job Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
