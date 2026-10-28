import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEligibility,
  filterJobs,
  loadStoredJobs,
  DEFAULT_STUDENT,
  INITIAL_SAMPLE_JOBS,
} from './eligibility.ts';
import { type Job, type StudentProfile } from '../types/placement.ts';

test('calculateEligibility returns eligible when all requirements met', () => {
  const student: StudentProfile = {
    name: 'Alex Rivera',
    rollNumber: 'CS-01',
    branch: 'Computer Science & Engineering',
    cgpa: 8.5,
    backlogs: 0,
    passingYear: 2026,
  };

  const job: Job = {
    id: 'test-1',
    companyName: 'Test Corp',
    companyLogoText: 'TC',
    role: 'Engineer',
    ctcPackage: '$12 LPA',
    numericCtc: 12,
    eligibleBranches: ['Computer Science & Engineering'],
    minCgpa: 7.5,
    maxBacklogs: 0,
    deadlineDate: '2026-12-01',
    location: 'Remote',
    jobType: 'Full-Time',
  };

  const result = calculateEligibility(student, job);
  assert.equal(result.isEligible, true);
  assert.equal(result.reasons.length, 0);
});

test('calculateEligibility fails when CGPA is below minimum', () => {
  const student: StudentProfile = {
    ...DEFAULT_STUDENT,
    cgpa: 7.4,
  };

  const job: Job = INITIAL_SAMPLE_JOBS.find(j => j.id === 'job-1')!; // minCgpa: 7.5
  const result = calculateEligibility(student, job);
  assert.equal(result.isEligible, false);
  assert.match(result.reasons[0], /Minimum CGPA 7.5 required/);
});

test('calculateEligibility fails when branch is not eligible', () => {
  const student: StudentProfile = {
    ...DEFAULT_STUDENT,
    branch: 'Mechanical Engineering',
  };

  const job: Job = INITIAL_SAMPLE_JOBS.find(j => j.id === 'job-1')!; // requires CS, IT
  const result = calculateEligibility(student, job);
  assert.equal(result.isEligible, false);
  assert.match(result.reasons[0], /Branch not eligible/);
});

test('calculateEligibility passes when job allows All Branches', () => {
  const student: StudentProfile = {
    ...DEFAULT_STUDENT,
    branch: 'Civil Engineering',
    cgpa: 7.5,
    backlogs: 0,
  };

  const job: Job = INITIAL_SAMPLE_JOBS.find(j => j.id === 'job-3')!; // allows All Branches, minCgpa 7.0
  const result = calculateEligibility(student, job);
  assert.equal(result.isEligible, true);
});

test('calculateEligibility fails when backlogs exceed maximum', () => {
  const student: StudentProfile = {
    ...DEFAULT_STUDENT,
    backlogs: 2,
  };

  const job: Job = INITIAL_SAMPLE_JOBS.find(j => j.id === 'job-3')!; // maxBacklogs: 1
  const result = calculateEligibility(student, job);
  assert.equal(result.isEligible, false);
  assert.match(result.reasons[0], /Maximum 1 active backlogs allowed/);
});

test('filterJobs filters correctly by search query and eligibility', () => {
  const student = { ...DEFAULT_STUDENT, cgpa: 8.2 }; // TechCorp eligible, Apex Quant ineligible (requires 8.5)

  // 1. Search by company name
  const techSearch = filterJobs(INITIAL_SAMPLE_JOBS, 'techcorp', 'all', 'all', student);
  assert.equal(techSearch.length, 1);
  assert.equal(techSearch[0].companyName, 'TechCorp Solutions');

  // 2. Filter by eligible only
  const eligibleOnly = filterJobs(INITIAL_SAMPLE_JOBS, '', 'all', 'eligible', student);
  assert.ok(eligibleOnly.every(j => calculateEligibility(student, j).isEligible));

  // 3. Filter by not-eligible only
  const notEligibleOnly = filterJobs(INITIAL_SAMPLE_JOBS, '', 'all', 'not-eligible', student);
  assert.ok(notEligibleOnly.every(j => !calculateEligibility(student, j).isEligible));
  // Apex Quant (requires 8.5) and CoreSilicon (requires ECE) should be in notEligibleOnly
  assert.ok(notEligibleOnly.some(j => j.companyName === 'Apex Quant Technologies'));
  assert.ok(notEligibleOnly.some(j => j.companyName === 'CoreSilicon Microelectronics'));
});
