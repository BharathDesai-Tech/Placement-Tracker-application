import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import {
  type UserRole,
  loadStoredRole,
  saveStoredRole,
  toggleRole,
} from './utils/mode.ts';
import {
  type Job,
  type StudentProfile,
  type Application,
  type ApplicationStage,
} from './types/placement.ts';
import {
  loadStoredJobs,
  saveStoredJobs,
  loadStoredStudent,
  saveStoredStudent,
  INITIAL_SAMPLE_JOBS,
} from './utils/eligibility.ts';
import {
  loadStoredApplicationRecords,
  saveStoredApplicationRecords,
  calculateReminderAlerts,
  createApplication,
} from './utils/application.ts';

export default function App() {
  // 1. Role State
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredRole(window.localStorage, 'student');
    }
    return 'student';
  });

  // 2. Jobs List State (Initialized with sample jobs from localStorage)
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredJobs(window.localStorage);
    }
    return INITIAL_SAMPLE_JOBS;
  });

  // 3. Student Profile State (From localStorage)
  const [student, setStudent] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredStudent(window.localStorage);
    }
    return {
      name: 'Alex Rivera',
      rollNumber: 'CS-2026-042',
      branch: 'Computer Science & Engineering',
      cgpa: 8.2,
      backlogs: 0,
      passingYear: 2026,
    };
  });

  // 4. Applications State (Saved to localStorage with Stage info)
  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredApplicationRecords(window.localStorage);
    }
    return [];
  });

  // 5. Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4500);
  };

  // 6. Reminder Alerts (Calculated dynamically for deadlines < 48 hours & interviews)
  const reminderAlerts = useMemo(() => {
    return calculateReminderAlerts(jobs, applications, new Date('2026-10-28T12:00:00'));
  }, [jobs, applications]);

  // Switch role & persist
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      saveStoredRole(window.localStorage, newRole);
    }
  };

  const handleToggleRole = () => {
    const next = toggleRole(role);
    handleRoleChange(next);
  };

  // Apply to job
  const handleApplyJob = (jobId: string) => {
    const existing = applications.find(a => a.jobId === jobId);
    if (existing) return;

    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    const newApp = createApplication(targetJob, student);
    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    
    // Also increment job appliedCount
    const updatedJobs = jobs.map(j => 
      j.id === jobId ? { ...j, appliedCount: (j.appliedCount || 0) + 1 } : j
    );
    setJobs(updatedJobs);

    if (typeof window !== 'undefined') {
      saveStoredApplicationRecords(window.localStorage, updatedApps);
      saveStoredJobs(window.localStorage, updatedJobs);
    }

    showToast(`Application successfully submitted for ${targetJob.companyName}! Track your stage progress above. 🎉`);
  };

  // Update application stage (Placement Officer control)
  const handleUpdateApplicationStage = (appId: string, newStage: ApplicationStage) => {
    const updatedApps = applications.map(app => 
      app.id === appId ? { ...app, currentStage: newStage } : app
    );
    setApplications(updatedApps);

    if (typeof window !== 'undefined') {
      saveStoredApplicationRecords(window.localStorage, updatedApps);
    }

    const targetApp = applications.find(a => a.id === appId);
    showToast(`Updated ${targetApp?.studentName || 'Candidate'} to stage: "${newStage}" ✓`);
  };

  // Update student profile
  const handleUpdateStudent = (updatedStudent: StudentProfile) => {
    setStudent(updatedStudent);
    if (typeof window !== 'undefined') {
      saveStoredStudent(window.localStorage, updatedStudent);
    }
    showToast(`Student profile updated. Eligibility re-calculated!`);
  };

  // Add new job (Placement Officer)
  const handleAddJob = (newJob: Job) => {
    const updated = [newJob, ...jobs];
    setJobs(updated);
    if (typeof window !== 'undefined') {
      saveStoredJobs(window.localStorage, updated);
    }
    showToast(`New recruitment drive for "${newJob.companyName}" published!`);
  };

  // Delete job
  const handleDeleteJob = (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    const updated = jobs.filter(j => j.id !== jobId);
    setJobs(updated);
    if (typeof window !== 'undefined') {
      saveStoredJobs(window.localStorage, updated);
    }
    showToast(`Removed placement drive for ${targetJob?.companyName || 'Job'}.`);
  };

  // Sync role to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveStoredRole(window.localStorage, role);
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-lg border border-slate-800 transition-all animate-in slide-in-from-bottom-3"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            ✕
          </button>
        </aside>
      )}

      {/* Top Navbar with mode toggle switch */}
      <Navbar
        currentRole={role}
        onRoleChange={handleRoleChange}
        studentName={student.name}
        studentBranch={student.branch}
      />

      {/* Responsive Dashboard Container with rounded cards & soft colors */}
      <div className="flex-1">
        <Dashboard
          currentRole={role}
          onToggleRole={handleToggleRole}
          jobs={jobs}
          student={student}
          applications={applications}
          reminderAlerts={reminderAlerts}
          onApplyJob={handleApplyJob}
          onUpdateStudent={handleUpdateStudent}
          onAddJob={handleAddJob}
          onDeleteJob={handleDeleteJob}
          onUpdateStage={handleUpdateApplicationStage}
        />
      </div>
    </div>
  );
}
