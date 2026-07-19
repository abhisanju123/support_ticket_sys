import { UserRole } from '../enums/user-role.enum.js';

export interface SeedUser {
  name: string;
  email: string;
  role: UserRole;
}

const parseRole = (value: string | undefined, fallback: UserRole): UserRole => {
  if (!value) {
    return fallback;
  }

  const normalized = value.toLowerCase().replace(/\s+/g, '_');
  const roleMap: Record<string, UserRole> = {
    employee: UserRole.EMPLOYEE,
    support_agent: UserRole.SUPPORT_AGENT,
    supportagent: UserRole.SUPPORT_AGENT,
    admin: UserRole.ADMIN,
    support_manager: UserRole.ADMIN,
    supportmanager: UserRole.ADMIN,
  };

  return roleMap[normalized] ?? fallback;
};

const envUser = (
  key: string,
  defaults: SeedUser,
): SeedUser => ({
  name: process.env[`SEED_USER_${key}_NAME`] ?? defaults.name,
  email: process.env[`SEED_USER_${key}_EMAIL`] ?? defaults.email,
  role: parseRole(process.env[`SEED_USER_${key}_ROLE`], defaults.role),
});

/**
 * Seed users loaded from environment variables with sensible defaults.
 * Override any user via SEED_USER_<KEY>_NAME | _EMAIL | _ROLE
 */
export const getSeedUsers = (): SeedUser[] => [
  envUser('JOHN', {
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.SUPPORT_AGENT,
  }),
  envUser('JANE', {
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: UserRole.ADMIN,
  }),
  envUser('ALEX', {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: UserRole.SUPPORT_AGENT,
  }),
  envUser('PRIYA', {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: UserRole.SUPPORT_AGENT,
  }),
  envUser('MARCUS', {
    name: 'Marcus Williams',
    email: 'marcus@example.com',
    role: UserRole.SUPPORT_AGENT,
  }),
  envUser('EMILY', {
    name: 'Emily Chen',
    email: 'emily@example.com',
    role: UserRole.EMPLOYEE,
  }),
  envUser('DAVID', {
    name: 'David Okonkwo',
    email: 'david@example.com',
    role: UserRole.EMPLOYEE,
  }),
  envUser('SARAH', {
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    role: UserRole.SUPPORT_AGENT,
  }),
  envUser('RAJ', {
    name: 'Raj Patel',
    email: 'raj@example.com',
    role: UserRole.ADMIN,
  }),
  envUser('NINA', {
    name: 'Nina Kowalski',
    email: 'nina@example.com',
    role: UserRole.EMPLOYEE,
  }),
  envUser('ABHISHEK', {
    name: 'Abhishek Mishra',
    email: 'abhishek@example.com',
    role: UserRole.EMPLOYEE,
  }),
];
