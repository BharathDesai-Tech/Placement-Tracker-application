import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidRole,
  toggleRole,
  getRoleDisplayName,
  loadStoredRole,
  saveStoredRole,
  STORAGE_KEY_ROLE,
  type UserRole,
  type StorageLike,
} from './mode.ts';

test('isValidRole validates only student and officer', () => {
  assert.equal(isValidRole('student'), true);
  assert.equal(isValidRole('officer'), true);
  assert.equal(isValidRole('admin'), false);
  assert.equal(isValidRole(''), false);
  assert.equal(isValidRole(null), false);
  assert.equal(isValidRole(undefined), false);
});

test('toggleRole alternates between student and officer', () => {
  assert.equal(toggleRole('student'), 'officer');
  assert.equal(toggleRole('officer'), 'student');
});

test('getRoleDisplayName provides human-readable label', () => {
  assert.equal(getRoleDisplayName('student'), 'Student');
  assert.equal(getRoleDisplayName('officer'), 'Placement Officer');
});

test('loadStoredRole loads role safely and falls back correctly', () => {
  const store = new Map<string, string>();
  const mockStorage: StorageLike = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => store.set(key, val),
  };

  // Initially empty -> fallback to student
  assert.equal(loadStoredRole(mockStorage), 'student');

  // Stored officer -> loads officer
  mockStorage.setItem(STORAGE_KEY_ROLE, 'officer');
  assert.equal(loadStoredRole(mockStorage), 'officer');

  // Stored invalid -> fallback
  mockStorage.setItem(STORAGE_KEY_ROLE, 'random_val');
  assert.equal(loadStoredRole(mockStorage), 'student');
});

test('saveStoredRole writes role to storage', () => {
  const store = new Map<string, string>();
  const mockStorage: StorageLike = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => store.set(key, val),
  };

  saveStoredRole(mockStorage, 'officer');
  assert.equal(store.get(STORAGE_KEY_ROLE), 'officer');

  saveStoredRole(mockStorage, 'student');
  assert.equal(store.get(STORAGE_KEY_ROLE), 'student');
});
