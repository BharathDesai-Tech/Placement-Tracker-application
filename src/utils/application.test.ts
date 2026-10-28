import test from 'node:test';
import assert from 'node:assert/strict';
import {
  APPLICATION_STAGES,
  getStageIndex,
  getStageProgressPercent,
  calculateReminderAlerts,
  createApplication,
  loadStoredApplicationRecords,
  saveStoredApplicationRecords,
  STORAGE_KEY_APPLICATION_RECORDS,
} from './application.ts';
import { type Job, type StudentProfile } from '../types/placement.ts';
import { type StorageLike } from './mode.ts';

test('APPLICATION_STAGES contains exactly 5 sequential stages', () => {
  assert.deepEqual(APPLICATION_STAGES, [
    'Applied',
    'Online Test',
    'Technical Interview',
    'HR Round',
    'Offer',
  ]);
});

test('getStageIndex returns proper 0-indexed positions', () => {
  assert.equal(getStageIndex('Applied'), 0);
  assert.equal(getStageIndex('Online Test'), 1);
  assert.equal(getStageIndex('Technical Interview'), 2);
  assert.equal(getStageIndex('HR Round'), 3);
  assert.equal(getStageIndex('Offer'), 4);
});

test('getStageProgressPercent returns proportional percentages', () => {
  assert.equal(getStageProgressPercent('Applied'), 0);
  assert.equal(getStageProgressPercent('Technical Interview'), 50);
  assert.equal(getStageProgressPercent('Offer'), 100);
});

test('calculateReminderAlerts detects urgent deadlines and upcoming interviews', () => {
  const refDate = new Date('2026-10-28T10:00:00');
  
  const mockJobs: Job[] = [
    {
      id: 'job-urgent',
      companyName: 'Urgent Tech',
      companyLogoText: 'UT',
      role: 'Developer',
      ctcPackage: '$15 LPA',
      numericCtc: 15,
      eligibleBranches: ['All Branches'],
      minCgpa: 7.0,
      maxBacklogs: 0,
      deadlineDate: '2026-10-29', // ~38 hours away -> under 48 hours!
      location: 'Remote',
      jobType: 'Full-Time',
    },
    {
      id: 'job-future',
      companyName: 'Future Soft',
      companyLogoText: 'FS',
      role: 'Engineer',
      ctcPackage: '$12 LPA',
      numericCtc: 12,
      eligibleBranches: ['All Branches'],
      minCgpa: 7.0,
      maxBacklogs: 0,
      deadlineDate: '2026-11-20', // Not urgent
      location: 'Remote',
      jobType: 'Full-Time',
    },
  ];

  const mockApps = [
    {
      id: 'app-test',
      jobId: 'job-urgent',
      studentName: 'Alex Rivera',
      studentRoll: 'CS-01',
      companyName: 'Urgent Tech',
      role: 'Developer',
      currentStage: 'Technical Interview' as const,
      appliedDate: '2026-10-25',
      nextEventDate: 'Tomorrow at 10:00 AM',
    },
  ];

  const alerts = calculateReminderAlerts(mockJobs, mockApps, refDate);

  // 1 deadline alert and 1 interview alert
  assert.equal(alerts.length, 2);
  const deadlineAlert = alerts.find(a => a.type === 'deadline');
  assert.ok(deadlineAlert);
  assert.match(deadlineAlert!.title, /Urgent Application Deadline: Urgent Tech/);

  const interviewAlert = alerts.find(a => a.type === 'interview');
  assert.ok(interviewAlert);
  assert.match(interviewAlert!.title, /Upcoming Interview: Urgent Tech/);
});

test('createApplication creates initial entry with Applied stage', () => {
  const student: StudentProfile = {
    name: 'Alex Rivera',
    rollNumber: 'CS-01',
    branch: 'Computer Science & Engineering',
    cgpa: 8.5,
    backlogs: 0,
    passingYear: 2026,
  };

  const job: Job = {
    id: 'job-abc',
    companyName: 'ABC Systems',
    companyLogoText: 'ABC',
    role: 'SDE',
    ctcPackage: '$14 LPA',
    numericCtc: 14,
    eligibleBranches: ['All Branches'],
    minCgpa: 6.5,
    maxBacklogs: 0,
    deadlineDate: '2026-11-30',
    location: 'Austin',
    jobType: 'Full-Time',
  };

  const app = createApplication(job, student);
  assert.equal(app.companyName, 'ABC Systems');
  assert.equal(app.currentStage, 'Applied');
  assert.equal(app.studentName, 'Alex Rivera');
});

test('loadStoredApplicationRecords loads and saves to storage', () => {
  const store = new Map<string, string>();
  const mockStorage: StorageLike = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => store.set(key, val),
  };

  const initial = loadStoredApplicationRecords(mockStorage);
  assert.ok(initial.length > 0);

  const modified = [
    ...initial,
    {
      id: 'app-999',
      jobId: 'job-999',
      studentName: 'Alex Rivera',
      studentRoll: 'CS-01',
      companyName: 'New Corp',
      role: 'Analyst',
      currentStage: 'Offer' as const,
      appliedDate: '2026-10-28',
    },
  ];

  saveStoredApplicationRecords(mockStorage, modified);
  const loaded = loadStoredApplicationRecords(mockStorage);
  assert.equal(loaded.length, modified.length);
  assert.equal(loaded[loaded.length - 1].companyName, 'New Corp');
});
