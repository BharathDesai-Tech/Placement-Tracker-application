export type Branch = 
  | 'Computer Science & Engineering'
  | 'Information Technology'
  | 'Electronics & Communication'
  | 'Electrical & Electronics'
  | 'Mechanical Engineering'
  | 'Civil Engineering';

export interface StudentProfile {
  name: string;
  rollNumber: string;
  branch: Branch;
  cgpa: number;
  backlogs: number;
  passingYear: number;
}

export interface Job {
  id: string;
  companyName: string;
  companyLogoText: string;
  role: string;
  ctcPackage: string; // e.g. "$18.5 LPA"
  numericCtc: number; // for filtering/sorting
  eligibleBranches: string[]; // e.g. ['Computer Science & Engineering', 'Information Technology'] or ['All Branches']
  minCgpa: number;
  maxBacklogs: number;
  deadlineDate: string; // YYYY-MM-DD
  location: string;
  jobType: 'Full-Time' | 'Internship + PPO' | 'Direct Hire';
  description?: string;
  appliedCount?: number;
}

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
}

export type ApplicationStage = 
  | 'Applied' 
  | 'Online Test' 
  | 'Technical Interview' 
  | 'HR Round' 
  | 'Offer';

export interface Application {
  id: string;
  jobId: string;
  studentName: string;
  studentRoll: string;
  companyName: string;
  role: string;
  currentStage: ApplicationStage;
  appliedDate: string;
  nextEventDate?: string;
  notes?: string;
}

export interface ReminderAlert {
  id: string;
  type: 'deadline' | 'interview';
  title: string;
  subtitle: string;
  dateStr: string;
  hoursRemaining?: number;
  severity: 'urgent' | 'warning' | 'info';
}
