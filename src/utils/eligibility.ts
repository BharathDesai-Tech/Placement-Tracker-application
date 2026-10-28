import { type Job, type StudentProfile, type EligibilityResult } from '../types/placement.ts';
import { type StorageLike } from './mode.ts';

export const STORAGE_KEY_JOBS = 'placement_portal_jobs';
export const STORAGE_KEY_STUDENT = 'placement_portal_student_profile';
export const STORAGE_KEY_APPLICATIONS = 'placement_portal_applied_jobs';

export const DEFAULT_STUDENT: StudentProfile = {
  name: 'Alex Rivera',
  rollNumber: 'CS-2026-042',
  branch: 'Computer Science & Engineering',
  cgpa: 8.2,
  backlogs: 0,
  passingYear: 2026,
};

export const INITIAL_SAMPLE_JOBS: Job[] = [
  {
    id: 'job-1',
    companyName: 'TechCorp Solutions',
    companyLogoText: 'TC',
    role: 'Associate Software Engineer (SDE-1)',
    ctcPackage: '$16.5 LPA',
    numericCtc: 16.5,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
    minCgpa: 7.5,
    maxBacklogs: 0,
    deadlineDate: '2026-11-12',
    location: 'Austin, TX / Remote',
    jobType: 'Full-Time',
    description: 'Work on distributed microservices and scalable cloud platforms.',
    appliedCount: 42,
  },
  {
    id: 'job-2',
    companyName: 'Apex Quant Technologies',
    companyLogoText: 'AQ',
    role: 'Quantitative Systems Analyst',
    ctcPackage: '$24.0 LPA',
    numericCtc: 24.0,
    eligibleBranches: ['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics'],
    minCgpa: 8.5, // Student Alex has 8.2 -> Not eligible due to CGPA!
    maxBacklogs: 0,
    deadlineDate: '2026-11-18',
    location: 'New York, NY',
    jobType: 'Full-Time',
    description: 'High-frequency algorithmic trading pipeline development and low-latency C++ services.',
    appliedCount: 28,
  },
  {
    id: 'job-3',
    companyName: 'Nexus Labs Innovations',
    companyLogoText: 'NL',
    role: 'Cloud DevOps & Infrastructure Engineer',
    ctcPackage: '$13.2 LPA',
    numericCtc: 13.2,
    eligibleBranches: ['All Branches'],
    minCgpa: 7.0, // Alex (8.2, 0 backlogs) is Eligible!
    maxBacklogs: 1,
    deadlineDate: '2026-11-08',
    location: 'Seattle, WA',
    jobType: 'Full-Time',
    description: 'Automate Kubernetes deployments, CI/CD observability, and multi-region AWS architectures.',
    appliedCount: 65,
  },
  {
    id: 'job-4',
    companyName: 'CoreSilicon Microelectronics',
    companyLogoText: 'CS',
    role: 'VLSI Chip Design & Verification Engineer',
    ctcPackage: '$17.0 LPA',
    numericCtc: 17.0,
    eligibleBranches: ['Electronics & Communication', 'Electrical & Electronics'], // Alex is CS -> Not eligible due to branch!
    minCgpa: 7.5,
    maxBacklogs: 0,
    deadlineDate: '2026-11-22',
    location: 'San Jose, CA',
    jobType: 'Full-Time',
    description: 'RTL design, SystemVerilog verification, and physical synthesis for neural accelerator ASIC.',
    appliedCount: 19,
  },
  {
    id: 'job-5',
    companyName: 'Starlight Global Consulting',
    companyLogoText: 'SG',
    role: 'Technology Consultant & Analyst',
    ctcPackage: '$11.8 LPA',
    numericCtc: 11.8,
    eligibleBranches: ['All Branches'],
    minCgpa: 6.5, // Alex is Eligible!
    maxBacklogs: 0,
    deadlineDate: '2026-10-29', // < 48h deadline!
    location: 'Chicago, IL',
    jobType: 'Full-Time',
    description: 'Bridge business strategy and modern enterprise software systems across Fortune 500 clients.',
    appliedCount: 88,
  },
];

/**
 * Evaluates whether a student meets the criteria for a job listing
 */
export function calculateEligibility(student: StudentProfile, job: Job): EligibilityResult {
  const reasons: string[] = [];

  // 1. CGPA Criterion
  if (student.cgpa < job.minCgpa) {
    reasons.push(`Minimum CGPA ${job.minCgpa.toFixed(1)} required (Current: ${student.cgpa.toFixed(1)})`);
  }

  // 2. Branch Criterion
  const allowsAll = job.eligibleBranches.some(b => b.toLowerCase() === 'all branches');
  if (!allowsAll) {
    const isBranchMatch = job.eligibleBranches.some(
      b => b.trim().toLowerCase() === student.branch.trim().toLowerCase()
    );
    if (!isBranchMatch) {
      reasons.push(`Branch not eligible (Requires: ${job.eligibleBranches.join(', ')})`);
    }
  }

  // 3. Backlog Criterion
  if (student.backlogs > job.maxBacklogs) {
    reasons.push(
      job.maxBacklogs === 0
        ? `No active backlogs permitted (Current: ${student.backlogs})`
        : `Maximum ${job.maxBacklogs} active backlogs allowed (Current: ${student.backlogs})`
    );
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}

/**
 * Filter and search jobs based on query, branch selection, and eligibility
 */
export function filterJobs(
  jobs: Job[],
  query: string,
  branchFilter: string,
  eligibilityFilter: 'all' | 'eligible' | 'not-eligible',
  student: StudentProfile
): Job[] {
  const cleanQuery = query.trim().toLowerCase();

  return jobs.filter(job => {
    // 1. Text Search (Company, Role, Location, Package)
    if (cleanQuery) {
      const matchCompany = job.companyName.toLowerCase().includes(cleanQuery);
      const matchRole = job.role.toLowerCase().includes(cleanQuery);
      const matchLocation = job.location.toLowerCase().includes(cleanQuery);
      const matchPackage = job.ctcPackage.toLowerCase().includes(cleanQuery);
      if (!matchCompany && !matchRole && !matchLocation && !matchPackage) {
        return false;
      }
    }

    // 2. Branch Filter Dropdown
    if (branchFilter && branchFilter !== 'all') {
      const allowsAll = job.eligibleBranches.some(b => b.toLowerCase() === 'all branches');
      const branchMatches = job.eligibleBranches.some(
        b => b.toLowerCase() === branchFilter.toLowerCase()
      );
      if (!allowsAll && !branchMatches) {
        return false;
      }
    }

    // 3. Eligibility Filter Dropdown
    if (eligibilityFilter !== 'all') {
      const { isEligible } = calculateEligibility(student, job);
      if (eligibilityFilter === 'eligible' && !isEligible) {
        return false;
      }
      if (eligibilityFilter === 'not-eligible' && isEligible) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Storage helpers with safe localStorage fallbacks
 */
export function loadStoredJobs(storage?: StorageLike): Job[] {
  if (!storage) return INITIAL_SAMPLE_JOBS;
  try {
    const raw = storage.getItem(STORAGE_KEY_JOBS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback on corrupt JSON or blocked storage
  }
  // Initialize default jobs if not set
  saveStoredJobs(storage, INITIAL_SAMPLE_JOBS);
  return INITIAL_SAMPLE_JOBS;
}

export function saveStoredJobs(storage: StorageLike | undefined, jobs: Job[]): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  } catch {
    // Ignore storage quota or access errors
  }
}

export function loadStoredStudent(storage?: StorageLike): StudentProfile {
  if (!storage) return DEFAULT_STUDENT;
  try {
    const raw = storage.getItem(STORAGE_KEY_STUDENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.name === 'string' && typeof parsed.cgpa === 'number') {
        return parsed;
      }
    }
  } catch {
    // Fallback on error
  }
  return DEFAULT_STUDENT;
}

export function saveStoredStudent(storage: StorageLike | undefined, student: StudentProfile): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(student));
  } catch {
    // Ignore storage write error
  }
}

export function loadStoredApplications(storage?: StorageLike): string[] {
  if (!storage) return ['job-1']; // TechCorp applied by default
  try {
    const raw = storage.getItem(STORAGE_KEY_APPLICATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  return ['job-1'];
}

export function saveStoredApplications(storage: StorageLike | undefined, appliedIds: string[]): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(appliedIds));
  } catch {
    // Ignore error
  }
}
