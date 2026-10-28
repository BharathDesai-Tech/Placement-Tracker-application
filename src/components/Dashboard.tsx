import React, { useState, useMemo } from 'react';
import { type UserRole } from '../utils/mode.ts';
import { 
  type Job, 
  type StudentProfile, 
  type Application, 
  type ApplicationStage,
  type ReminderAlert 
} from '../types/placement.ts';
import { calculateEligibility, filterJobs } from '../utils/eligibility.ts';
import { StudentProfileBar } from './StudentProfileBar.tsx';
import { JobCard } from './JobCard.tsx';
import { JobFilterBar } from './JobFilterBar.tsx';
import { AddJobModal } from './AddJobModal.tsx';
import { ReminderAlertBox } from './ReminderAlertBox.tsx';
import { ApplicationTracker } from './ApplicationTracker.tsx';
import { OfficerCandidatePipeline } from './OfficerCandidatePipeline.tsx';

interface DashboardProps {
  currentRole: UserRole;
  onToggleRole: () => void;
  jobs: Job[];
  student: StudentProfile;
  applications: Application[];
  reminderAlerts: ReminderAlert[];
  onApplyJob: (jobId: string) => void;
  onUpdateStudent: (student: StudentProfile) => void;
  onAddJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateStage: (appId: string, stage: ApplicationStage) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentRole,
  onToggleRole,
  jobs,
  student,
  applications,
  reminderAlerts,
  onApplyJob,
  onUpdateStudent,
  onAddJob,
  onDeleteJob,
  onUpdateStage,
}) => {
  const isOfficer = currentRole === 'officer';

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible' | 'not-eligible'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtered jobs computation
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, searchQuery, branchFilter, eligibilityFilter, student);
  }, [jobs, searchQuery, branchFilter, eligibilityFilter, student]);

  // Dynamic statistics
  const eligibleJobsCount = useMemo(() => {
    return jobs.filter(j => calculateEligibility(student, j).isEligible).length;
  }, [jobs, student]);

  const appliedJobIds = useMemo(() => {
    return applications.map(a => a.jobId);
  }, [applications]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setBranchFilter('all');
    setEligibilityFilter('all');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* 1. Urgent Reminder Alert Box (< 48 Hours Deadlines & Upcoming Interviews) */}
      <ReminderAlertBox alerts={reminderAlerts} />

      {/* 2. Header Banner Card with soft colors and rounded corners */}
      <section className="bg-linear-to-r from-white via-indigo-50/40 to-purple-50/40 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-xs">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isOfficer ? 'bg-purple-500' : 'bg-emerald-500'}`} />
              <span className="text-slate-700">
                Current View: <strong className={isOfficer ? 'text-purple-700' : 'text-indigo-700'}>
                  {isOfficer ? 'Placement Officer Desk' : 'Student Career Portal'}
                </strong>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">AY 2025-2026</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isOfficer 
                ? 'Campus Placement Operations & Analytics'
                : `Welcome back, ${student.name} 👋`}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isOfficer
                ? 'Publish company drives, evaluate eligibility criteria, and update candidate progression across recruitment rounds.'
                : 'Browse campus drives, track your live multi-stage interview progress, and review automated eligibility verification.'}
            </p>
          </div>

          {/* Quick interactive action card inside banner */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {isOfficer && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Post New Drive</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleRole}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm border transition-all shadow-xs ${
                isOfficer
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Switch to {isOfficer ? 'Student Mode' : 'Officer Mode'}</span>
            </button>
          </div>
        </div>

        {/* Decorative soft backdrop elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-indigo-100/50 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-100/40 blur-2xl pointer-events-none" />
      </section>

      {/* 3. Student Profile Bar at Top (Student Mode) */}
      {!isOfficer && (
        <StudentProfileBar
          student={student}
          onUpdateStudent={onUpdateStudent}
        />
      )}

      {/* 4. Key Metrics Row - 4 Rounded Cards with Soft Colors */}
      <section aria-label="Key Placement Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Soft Sky Blue */}
          <div className="bg-sky-50/70 border border-sky-100/90 rounded-2xl p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase text-sky-800">
                {isOfficer ? 'Registered Candidates' : 'Eligible Drives'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-950">
                {isOfficer ? '480' : `${eligibleJobsCount} of ${jobs.length}`}
              </span>
              <p className="text-xs text-sky-700 mt-1">
                {isOfficer ? 'Active students in placement cohort' : `Matches your ${student.cgpa.toFixed(1)} CGPA & branch criteria`}
              </p>
            </div>
          </div>

          {/* Card 2: Soft Violet/Indigo */}
          <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-2xl p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase text-indigo-800">
                {isOfficer ? 'Active Company Drives' : 'Applications Tracked'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-950">
                {isOfficer ? jobs.length : applications.length}
              </span>
              <p className="text-xs text-indigo-700 mt-1">
                {isOfficer ? `${jobs.length} drives registered on portal` : 'Saved in localStorage and active'}
              </p>
            </div>
          </div>

          {/* Card 3: Soft Amber/Peach */}
          <div className="bg-amber-50/70 border border-amber-100/90 rounded-2xl p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase text-amber-800">
                {isOfficer ? 'In Assessment Rounds' : 'Interview Rounds'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-950">
                {isOfficer ? '38 Candidates' : '2 Active'}
              </span>
              <p className="text-xs text-amber-700 mt-1">
                {isOfficer ? 'Technical & HR interview stages' : 'TechCorp Technical Interview scheduled'}
              </p>
            </div>
          </div>

          {/* Card 4: Soft Emerald Green */}
          <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-2xl p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-800">
                {isOfficer ? 'Placement Rate' : 'Offers Extended'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                {isOfficer ? '78.5%' : `${applications.filter(a => a.currentStage === 'Offer').length} Offer`}
              </span>
              <p className="text-xs text-emerald-700 mt-1">
                {isOfficer ? '376 of 480 eligible students placed' : 'Apex Systems Offer Letter ready'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Application Tracker (Part 4 Requirement - Applied Jobs with Step Progress Line) */}
      {!isOfficer && (
        <ApplicationTracker applications={applications} />
      )}

      {/* 6. Officer Pipeline Section (Final Part - Post Drive Form & Stage Dropdown) */}
      {isOfficer && (
        <OfficerCandidatePipeline
          applications={applications}
          onUpdateStage={onUpdateStage}
          onAddJob={onAddJob}
        />
      )}

      {/* 7. Search & Filter Bar (Part 2) */}
      <JobFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        branchFilter={branchFilter}
        onBranchFilterChange={setBranchFilter}
        eligibilityFilter={eligibilityFilter}
        onEligibilityFilterChange={setEligibilityFilter}
        totalCount={jobs.length}
        filteredCount={filteredJobs.length}
        onResetFilters={handleResetFilters}
      />

      {/* 8. Main Content Section: Dynamic Job Listings and Side Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Cards Grid */}
        <section className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Campus Recruitment Drives & Vacancies
              </h2>
              <p className="text-xs text-slate-500">
                Instant eligibility evaluation comparing branch, CGPA, and backlogs
              </p>
            </div>
          </div>

          {/* Job Cards List */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  student={student}
                  currentRole={currentRole}
                  isApplied={appliedJobIds.includes(job.id)}
                  onApply={onApplyJob}
                  onDeleteJob={onDeleteJob}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800">No drives match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search keyword, changing the branch selection, or switching the eligibility filter.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </section>

        {/* Right Column: Schedule & Notice Board */}
        <aside className="space-y-6">
          
          {/* Card: Upcoming Schedule & Milestones */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Schedule & Deadlines</h3>
              <span className="text-[11px] font-medium text-slate-500">Next 7 Days</span>
            </div>

            <div className="space-y-3.5">
              
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0 ring-4 ring-amber-50" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-800">TechCorp Technical Assessment</p>
                  <p className="text-slate-500 text-[11px]">Room 302 • Tomorrow at 10:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1.5 shrink-0 ring-4 ring-rose-50" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-800">Starlight Consulting Deadline</p>
                  <p className="text-rose-600 font-semibold text-[11px]">Closes in under 48 hours (Oct 29)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1.5 shrink-0 ring-4 ring-indigo-50" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-800">Nexus Labs Pre-Placement Talk</p>
                  <p className="text-slate-500 text-[11px]">Seminar Hall 1 • Nov 08, 02:00 PM</p>
                </div>
              </div>

            </div>
          </div>

          {/* Card: Soft Notice Board & Guidelines */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Placement Guidelines</h3>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Official</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Stage Progression</span>
                  <span className="text-[10px] text-slate-400">Policy</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Candidates clearing technical rounds must report to the Placement Cell for offline verification before final HR rounds.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Multiple Offer Rule</span>
                  <span className="text-[10px] text-slate-400">Rule 4.2</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Upon receiving a dream tier offer ($15+ LPA), candidates are marked placed to give opportunities to fellow classmates.
                </p>
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* 9. Footer Layout and Storage Sync Banner */}
      <footer className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span>
            <strong>Placement Tracking Portal Complete:</strong> {jobs.length} drives • {applications.length} applications tracked with live stage progression in localStorage.
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 font-mono text-[11px]">
            Mode: <span className="font-semibold text-slate-800">{currentRole}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 font-mono text-[11px]">
            Stage Sync: <span className="font-semibold text-emerald-700">Active</span>
          </span>
        </div>
      </footer>

      {/* Placement Officer Add Job Modal */}
      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddJob={onAddJob}
      />

    </main>
  );
};
