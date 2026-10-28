import React, { useState } from 'react';
import { type Application, type ApplicationStage, type Job } from '../types/placement.ts';
import { APPLICATION_STAGES, getStageIndex } from '../utils/application.ts';

interface OfficerCandidatePipelineProps {
  applications: Application[];
  onUpdateStage: (appId: string, newStage: ApplicationStage) => void;
  onAddJob: (job: Job) => void;
}

export const OfficerCandidatePipeline: React.FC<OfficerCandidatePipelineProps> = ({
  applications,
  onUpdateStage,
  onAddJob,
}) => {
  // New Job Form State
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [ctcPackage, setCtcPackage] = useState('');
  const [eligibleBranch, setEligibleBranch] = useState('Computer Science & Engineering, Information Technology');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [deadlineDate, setDeadlineDate] = useState('2026-11-28');
  const [location, setLocation] = useState('On-Campus / Austin');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim() || !ctcPackage.trim()) return;

    const initials = companyName
      .trim()
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CP';

    const numericCtc = parseFloat(ctcPackage.replace(/[^0-9.]/g, '')) || 12;
    const branches = eligibleBranch.split(',').map(b => b.trim()).filter(Boolean);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      companyName: companyName.trim(),
      companyLogoText: initials,
      role: role.trim(),
      ctcPackage: ctcPackage.trim(),
      numericCtc,
      eligibleBranches: branches.length > 0 ? branches : ['All Branches'],
      minCgpa: parseFloat(minCgpa) || 6.5,
      maxBacklogs: 0,
      deadlineDate: deadlineDate || '2026-11-30',
      location: location.trim() || 'On-Campus',
      jobType: 'Full-Time',
      description: 'Newly registered campus recruitment drive for final year students.',
      appliedCount: 0,
    };

    onAddJob(newJob);
    // Reset form
    setCompanyName('');
    setRole('');
    setCtcPackage('');
  };

  const handleAdvance = (app: Application) => {
    const currentIndex = getStageIndex(app.currentStage);
    if (currentIndex < APPLICATION_STAGES.length - 1) {
      const nextStage = APPLICATION_STAGES[currentIndex + 1];
      onUpdateStage(app.id, nextStage);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Placement Officer Post New Company Drive Form */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Post New Placement Drive
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Officer Form
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill details to publish a new campus recruitment drive and store in localStorage
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateJob} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="officer-company-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name
              </label>
              <input
                id="officer-company-name"
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Goldman Sachs, Atlassian"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div>
              <label htmlFor="officer-job-role" className="block text-xs font-semibold text-slate-700 mb-1">
                Role Title
              </label>
              <input
                id="officer-job-role"
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Graduate SDE, Cloud Specialist"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div>
              <label htmlFor="officer-ctc-package" className="block text-xs font-semibold text-slate-700 mb-1">
                CTC Package
              </label>
              <input
                id="officer-ctc-package"
                type="text"
                required
                value={ctcPackage}
                onChange={e => setCtcPackage(e.target.value)}
                placeholder="e.g. $19.5 LPA"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="officer-min-cgpa" className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum CGPA
              </label>
              <input
                id="officer-min-cgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={minCgpa}
                onChange={e => setMinCgpa(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div>
              <label htmlFor="officer-deadline-date" className="block text-xs font-semibold text-slate-700 mb-1">
                Application Deadline
              </label>
              <input
                id="officer-deadline-date"
                type="date"
                required
                value={deadlineDate}
                onChange={e => setDeadlineDate(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div>
              <label htmlFor="officer-location" className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                id="officer-location"
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Boston, MA / Remote"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label htmlFor="officer-branches" className="block text-xs font-semibold text-slate-700 mb-1">
              Eligible Branches (comma separated, or &lsquo;All Branches&rsquo;)
            </label>
            <input
              id="officer-branches"
              type="text"
              required
              value={eligibleBranch}
              onChange={e => setEligibleBranch(e.target.value)}
              placeholder="Computer Science & Engineering, Information Technology"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Publish Company Drive</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. Candidate Recruitment Stage Manager & Dropdown */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Candidate Interview Stage Manager
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Status Dropdown
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any candidate and update their stage to advance them through rounds (stored in localStorage)
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {applications.length} Active Applicants
          </span>
        </div>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold bg-slate-50/50">
                  <th className="py-3 px-4 rounded-l-xl">Candidate</th>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Update Stage</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map(app => {
                  const stageIdx = getStageIndex(app.currentStage);
                  const isMaxStage = stageIdx >= APPLICATION_STAGES.length - 1;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Candidate info */}
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <div>
                          <span>{app.studentName}</span>
                          <span className="block text-[10px] font-mono text-slate-400 font-normal">
                            {app.studentRoll}
                          </span>
                        </div>
                      </td>

                      {/* Company & Role */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 block">{app.companyName}</span>
                        <span className="text-[11px] text-slate-500">{app.role}</span>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-4 text-slate-600">
                        {app.appliedDate}
                      </td>

                      {/* Current Stage Badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          app.currentStage === 'Offer'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            app.currentStage === 'Offer' ? 'bg-emerald-500' : 'bg-purple-500'
                          }`} />
                          <span>{app.currentStage}</span>
                        </span>
                      </td>

                      {/* Update Stage Dropdown */}
                      <td className="py-4 px-4">
                        <label htmlFor={`stage-select-${app.id}`} className="sr-only">Update Stage for {app.studentName}</label>
                        <select
                          id={`stage-select-${app.id}`}
                          value={app.currentStage}
                          onChange={e => onUpdateStage(app.id, e.target.value as ApplicationStage)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-xs shadow-2xs cursor-pointer"
                        >
                          {APPLICATION_STAGES.map(stage => (
                            <option key={stage} value={stage}>
                              {stage} {stage === app.currentStage ? '(Current)' : ''}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Quick Action Button */}
                      <td className="py-4 px-4 text-right">
                        {!isMaxStage ? (
                          <button
                            type="button"
                            onClick={() => handleAdvance(app)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors shadow-2xs"
                            title={`Promote candidate to ${APPLICATION_STAGES[stageIdx + 1]}`}
                          >
                            <span>Next: {APPLICATION_STAGES[stageIdx + 1]}</span>
                            <span>➔</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                            Offer Completed ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
            No student applications registered yet.
          </div>
        )}
      </section>

    </div>
  );
};
