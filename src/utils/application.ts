import { 
  type Application, 
  type ApplicationStage, 
  type Job, 
  type ReminderAlert, 
  type StudentProfile 
} from '../types/placement.ts';
import { type StorageLike } from './mode.ts';

export const APPLICATION_STAGES: ApplicationStage[] = [
  'Applied',
  'Online Test',
  'Technical Interview',
  'HR Round',
  'Offer',
];

export const STORAGE_KEY_APPLICATION_RECORDS = 'placement_portal_application_records';

export function getStageIndex(stage: ApplicationStage): number {
  const idx = APPLICATION_STAGES.indexOf(stage);
  return idx === -1 ? 0 : idx;
}

export function getStageProgressPercent(stage: ApplicationStage): number {
  const idx = getStageIndex(stage);
  return (idx / (APPLICATION_STAGES.length - 1)) * 100;
}

export const INITIAL_APPLICATION_RECORDS: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    studentName: 'Alex Rivera',
    studentRoll: 'CS-2026-042',
    companyName: 'TechCorp Solutions',
    role: 'Associate Software Engineer (SDE-1)',
    currentStage: 'Technical Interview',
    appliedDate: '2026-10-24',
    nextEventDate: 'Tomorrow at 10:00 AM (Room 302)',
    notes: 'Cleared Online Assessment (94%). Technical interview scheduled with Senior Engineering Lead.',
  },
  {
    id: 'app-2',
    jobId: 'job-5',
    studentName: 'Alex Rivera',
    studentRoll: 'CS-2026-042',
    companyName: 'Starlight Global Consulting',
    role: 'Technology Consultant & Analyst',
    currentStage: 'Online Test',
    appliedDate: '2026-10-26',
    nextEventDate: 'Nov 02, 04:00 PM',
    notes: 'Application reviewed and approved for Aptitude & Reasoning round.',
  },
];

/**
 * Calculates deadline warnings (< 48 hours) and upcoming interview reminders
 */
export function calculateReminderAlerts(
  jobs: Job[],
  applications: Application[],
  referenceDate: Date = new Date('2026-10-28T12:00:00')
): ReminderAlert[] {
  const alerts: ReminderAlert[] = [];
  const refTime = referenceDate.getTime();

  // 1. Check for urgent job application deadlines (< 48h)
  jobs.forEach(job => {
    // Treat deadline as end-of-day 23:59:59
    const deadlineTime = new Date(`${job.deadlineDate}T23:59:59`).getTime();
    const diffHours = (deadlineTime - refTime) / (1000 * 60 * 60);

    if (diffHours > 0 && diffHours <= 48) {
      alerts.push({
        id: `alert-deadline-${job.id}`,
        type: 'deadline',
        title: `Urgent Application Deadline: ${job.companyName}`,
        subtitle: `Registration for ${job.role} (${job.ctcPackage}) closes in ${Math.round(diffHours)} hours.`,
        dateStr: job.deadlineDate,
        hoursRemaining: Math.round(diffHours),
        severity: 'urgent',
      });
    }
  });

  // 2. Check for upcoming interviews in applications
  applications.forEach(app => {
    if (app.currentStage === 'Technical Interview' || app.currentStage === 'HR Round') {
      alerts.push({
        id: `alert-interview-${app.id}`,
        type: 'interview',
        title: `Upcoming Interview: ${app.companyName} (${app.currentStage})`,
        subtitle: app.nextEventDate 
          ? `Scheduled for ${app.nextEventDate}. Review core CS fundamentals & projects.`
          : `Interview round scheduled. Check your college inbox for meeting link.`,
        dateStr: app.nextEventDate || 'Upcoming',
        severity: 'warning',
      });
    }
  });

  return alerts;
}

/**
 * Create a new application entry when student applies to a job
 */
export function createApplication(
  job: Job,
  student: StudentProfile
): Application {
  return {
    id: `app-${Date.now()}`,
    jobId: job.id,
    studentName: student.name,
    studentRoll: student.rollNumber,
    companyName: job.companyName,
    role: job.role,
    currentStage: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    nextEventDate: 'Document verification in progress',
    notes: 'Application registered. Awaiting initial shortlist for online assessment round.',
  };
}

/**
 * Storage helpers
 */
export function loadStoredApplicationRecords(storage?: StorageLike): Application[] {
  if (!storage) return INITIAL_APPLICATION_RECORDS;
  try {
    const raw = storage.getItem(STORAGE_KEY_APPLICATION_RECORDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  saveStoredApplicationRecords(storage, INITIAL_APPLICATION_RECORDS);
  return INITIAL_APPLICATION_RECORDS;
}

export function saveStoredApplicationRecords(
  storage: StorageLike | undefined,
  records: Application[]
): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY_APPLICATION_RECORDS, JSON.stringify(records));
  } catch {
    // Ignore error
  }
}
