import React, { useState } from 'react';
import { type ReminderAlert } from '../types/placement.ts';

interface ReminderAlertBoxProps {
  alerts: ReminderAlert[];
}

export const ReminderAlertBox: React.FC<ReminderAlertBoxProps> = ({ alerts }) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  if (activeAlerts.length === 0) return null;

  return (
    <aside 
      aria-label="Urgent Deadlines and Interview Reminders"
      className="space-y-3"
    >
      {activeAlerts.map(alert => {
        const isUrgent = alert.type === 'deadline';

        return (
          <div
            key={alert.id}
            role="alert"
            className={`rounded-2xl p-4 sm:p-4.5 border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
              isUrgent
                ? 'bg-linear-to-r from-rose-50/90 via-amber-50/70 to-rose-50/90 border-rose-200/90 text-rose-950'
                : 'bg-linear-to-r from-indigo-50/90 via-purple-50/70 to-indigo-50/90 border-indigo-200/90 text-indigo-950'
            }`}
          >
            {/* Left: Icon & Alert Text */}
            <div className="flex items-start gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
                isUrgent ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {isUrgent ? (
                  // Clock / Alarm Icon
                  <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  // Calendar / Interview Icon
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider ${
                    isUrgent ? 'bg-rose-200/80 text-rose-900' : 'bg-indigo-200/80 text-indigo-900'
                  }`}>
                    {isUrgent ? 'Urgent Deadline' : 'Interview Scheduled'}
                  </span>
                  {alert.hoursRemaining !== undefined && (
                    <span className="text-[11px] font-bold text-rose-700">
                      Ends in ~{alert.hoursRemaining}h
                    </span>
                  )}
                  <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {alert.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {alert.subtitle}
                </p>
              </div>
            </div>

            {/* Right: Action and Dismiss */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setDismissedIds(prev => [...prev, alert.id])}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors"
                title="Dismiss reminder"
              >
                Dismiss
              </button>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
