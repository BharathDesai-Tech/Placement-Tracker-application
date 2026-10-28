import React from 'react';
import { type Application, type ApplicationStage } from '../types/placement.ts';
import { APPLICATION_STAGES, getStageIndex } from '../utils/application.ts';

interface ApplicationTrackerProps {
  applications: Application[];
  onWithdraw?: (appId: string) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
}) => {
  if (applications.length === 0) {
    return (
      <section 
        aria-label="Application Tracker"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-center space-y-3"
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800">No Applications Submitted Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Explore eligible company recruitment drives below and click &ldquo;Apply Now&rdquo; to track your live recruitment stages here.
        </p>
      </section>
    );
  }

  return (
    <section 
      aria-label="Application Tracker"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Applied Jobs & Recruitment Stage Tracker
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              {applications.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time progression through Aptitude, Technical, and HR recruitment rounds
          </p>
        </div>
      </div>

      {/* List of Applied Jobs with Horizontal Step Progress Line */}
      <div className="space-y-6">
        {applications.map(app => {
          const currentStageIndex = getStageIndex(app.currentStage);
          const isOfferExtended = app.currentStage === 'Offer';

          return (
            <article 
              key={app.id}
              data-testid={`app-tracker-${app.id}`}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 sm:p-6 shadow-xs hover:border-indigo-200 transition-all space-y-6"
            >
              {/* Job Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center shrink-0 text-sm shadow-2xs">
                    {app.companyName.split(' ').map(w => w[0]).join('').slice(0, 2) || 'CP'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900">
                        {app.companyName}
                      </h3>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isOfferExtended
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                      }`}>
                        {isOfferExtended ? 'Offer Extended 🎉' : `Current: ${app.currentStage}`}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {app.role}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 text-xs">
                  <span className="text-slate-400 block text-[11px]">Date Applied</span>
                  <span className="font-semibold text-slate-700">{app.appliedDate}</span>
                </div>
              </div>

              {/* Horizontal Step Progress Line */}
              <div className="pt-2 pb-1">
                <div className="relative">
                  
                  {/* Connecting Background Line */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block" />
                  
                  {/* Active Completed Progress Line */}
                  <div 
                    className="absolute top-4 left-6 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block"
                    style={{
                      width: `calc(${(currentStageIndex / (APPLICATION_STAGES.length - 1)) * 100}% - 48px)`,
                    }}
                  />

                  {/* 5 Stages Grid */}
                  <ol className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2">
                    {APPLICATION_STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isActive = idx === currentStageIndex;
                      const isPending = idx > currentStageIndex;

                      return (
                        <li 
                          key={stage}
                          className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-2.5 sm:gap-2"
                        >
                          {/* Step Circle Indicator */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-xs ring-4 ring-emerald-50'
                                : isActive
                                ? 'bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100 scale-110'
                                : 'bg-slate-200 text-slate-500 border border-slate-300'
                            }`}
                          >
                            {isCompleted ? (
                              <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          {/* Step Label */}
                          <div className="min-w-0">
                            <span className={`block text-xs leading-tight ${
                              isActive
                                ? 'font-extrabold text-indigo-950'
                                : isCompleted
                                ? 'font-bold text-emerald-800'
                                : 'font-medium text-slate-400'
                            }`}>
                              {stage}
                            </span>
                            {isActive && (
                              <span className="inline-block text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider">
                                Active Stage
                              </span>
                            )}
                            {isCompleted && (
                              <span className="hidden sm:inline-block text-[10px] text-emerald-600 font-medium">
                                Cleared ✓
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                </div>
              </div>

              {/* Status Note / Upcoming Event banner */}
              {(app.nextEventDate || app.notes) && (
                <div className="rounded-xl bg-white border border-slate-200/80 p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-slate-600">
                      <strong>Next Step:</strong> {app.nextEventDate || 'Stage review in progress'}
                    </span>
                  </div>
                  {app.notes && (
                    <span className="text-slate-500 text-[11px] italic">
                      {app.notes}
                    </span>
                  )}
                </div>
              )}

            </article>
          );
        })}
      </div>

    </section>
  );
};
