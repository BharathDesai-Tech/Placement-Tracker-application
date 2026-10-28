import React from 'react';
import { type Job, type StudentProfile } from '../types/placement.ts';
import { calculateEligibility } from '../utils/eligibility.ts';
import { type UserRole } from '../utils/mode.ts';

interface JobCardProps {
  job: Job;
  student: StudentProfile;
  currentRole: UserRole;
  isApplied: boolean;
  onApply: (jobId: string) => void;
  onDeleteJob?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  student,
  currentRole,
  isApplied,
  onApply,
  onDeleteJob,
}) => {
  const isOfficer = currentRole === 'officer';
  const { isEligible, reasons } = calculateEligibility(student, job);

  // Format deadline date nicely
  const formattedDate = new Date(job.deadlineDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article 
      data-testid={`job-card-${job.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between gap-5 relative overflow-hidden"
    >
      {/* Top Details & Tags */}
      <div className="space-y-4">
        
        {/* Header Row: Logo, Company & Eligibility Tag */}
        <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-start gap-3 min-w-0">
            {/* Company Avatar */}
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 border border-slate-200/80 text-slate-700 font-extrabold flex items-center justify-center shrink-0 text-base shadow-2xs">
              {job.companyLogoText}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {job.companyName}
                </h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {job.jobType}
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                {job.role}
              </p>
            </div>
          </div>

          {/* Right Status / Eligibility Badge */}
          <div className="shrink-0 flex items-center gap-2 self-start">
            {isEligible ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Eligible</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Not Eligible</span>
              </span>
            )}
          </div>
        </div>

        {/* Key Job Specifications Badges (CTC, CGPA, Branches, Deadline) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          
          {/* CTC Package */}
          <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[10px] uppercase font-bold text-indigo-500 block">CTC Package</span>
            <span className="font-extrabold text-sm text-indigo-950 mt-0.5 block">{job.ctcPackage}</span>
          </div>

          {/* Minimum CGPA */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Min CGPA</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{job.minCgpa.toFixed(1)}+ / 10.0</span>
          </div>

          {/* Eligible Branches */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligible Branch</span>
            <span className="font-semibold text-slate-800 mt-0.5 truncate block" title={job.eligibleBranches.join(', ')}>
              {job.eligibleBranches.join(', ')}
            </span>
          </div>

          {/* Deadline Date */}
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100/90 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Deadline Date</span>
            <span className="font-bold text-xs text-amber-950 mt-0.5 block">{formattedDate}</span>
          </div>

        </div>

        {/* Job Description & Location */}
        {job.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}

        {/* Reason banner if Not Eligible */}
        {!isEligible && reasons.length > 0 && (
          <div className="rounded-xl bg-rose-50/90 border border-rose-200/80 p-3 text-xs text-rose-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-900">
              <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Ineligibility Reason:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-rose-700">
              {reasons.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Card Footer: Location info & Action Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Location & Applicants */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{job.location}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>{job.appliedCount || 0} applicants</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
          
          {isOfficer ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                Officer View
              </span>
              {onDeleteJob && (
                <button
                  type="button"
                  onClick={() => onDeleteJob(job.id)}
                  aria-label={`Remove drive for ${job.companyName}`}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                >
                  Remove Drive
                </button>
              )}
            </div>
          ) : (
            /* Student Action Buttons */
            isApplied ? (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default shadow-2xs"
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Applied</span>
              </button>
            ) : isEligible ? (
              <button
                type="button"
                onClick={() => onApply(job.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <span>Apply Now</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                disabled
                title="You do not meet the minimum eligibility criteria for this job"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span>Apply Disabled</span>
              </button>
            )
          )}

        </div>

      </div>

    </article>
  );
};
