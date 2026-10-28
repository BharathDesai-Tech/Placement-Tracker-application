export type UserRole = 'student' | 'officer';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const STORAGE_KEY_ROLE = 'placement_portal_user_role';

export function isValidRole(role: unknown): role is UserRole {
  return role === 'student' || role === 'officer';
}

export function toggleRole(currentRole: UserRole): UserRole {
  return currentRole === 'student' ? 'officer' : 'student';
}

export function getRoleDisplayName(role: UserRole): string {
  return role === 'student' ? 'Student' : 'Placement Officer';
}

export function loadStoredRole(storage?: StorageLike, fallback: UserRole = 'student'): UserRole {
  if (!storage) return fallback;
  try {
    const val = storage.getItem(STORAGE_KEY_ROLE);
    if (isValidRole(val)) {
      return val;
    }
  } catch {
    // Ignore storage read errors (e.g. restricted iframe storage)
  }
  return fallback;
}

export function saveStoredRole(storage: StorageLike | undefined, role: UserRole): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY_ROLE, role);
  } catch {
    // Ignore storage write errors
  }
}
