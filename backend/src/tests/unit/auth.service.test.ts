import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { env } from '../../config/env.js';
import { ConflictException, UnauthorizedException } from '../../exceptions/index.js';
import { AuthService, hashPassword } from '../../services/auth/auth.service.js';
import type { IUserRecord } from '../../interfaces/user.interface.js';
import type { IUserRepository } from '../../repositories/interfaces/user.repository.interface.js';
import { UserRole } from '../../enums/user-role.enum.js';

const createUser = (overrides: Partial<IUserRecord> = {}): IUserRecord => ({
  _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
  name: 'John Doe',
  email: 'john@example.com',
  role: UserRole.EMPLOYEE,
  passwordHash: '$2a$12$hashed-password',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

describe('AuthService', () => {
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    findAll: jest.fn(),
    existsById: jest.fn(),
    create: jest.fn(),
  } satisfies IUserRepository;

  const authService = new AuthService(userRepository);
  let passwordHash = '';

  beforeAll(async () => {
    passwordHash = await hashPassword('Password123!');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('issues a JWT that expires in 30 minutes', async () => {
    const user = createUser({ passwordHash });
    userRepository.findByEmailWithPassword.mockResolvedValue(user);

    const result = await authService.login('john@example.com', 'Password123!');

    expect(result.expiresIn).toBe('30m');
    expect(result.token).toBeTruthy();

    const decoded = jwt.decode(result.token) as jwt.JwtPayload;
    expect(decoded.sub).toBe(user._id.toString());
    expect(decoded.email).toBe(user.email);
    expect(decoded.role).toBe(user.role);
    expect(decoded.exp).toBeDefined();

    const ttlSeconds = (decoded.exp ?? 0) - (decoded.iat ?? 0);
    expect(ttlSeconds).toBe(30 * 60);
  });

  it('rejects invalid credentials', async () => {
    userRepository.findByEmailWithPassword.mockResolvedValue(null);

    await expect(authService.login('missing@example.com', 'Password123!')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('registers a new user and returns a JWT', async () => {
    const user = createUser({ email: 'new.user@example.com', name: 'New User' });

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(user);

    const result = await authService.register('New User', 'new.user@example.com', 'Password123!');

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New User',
        email: 'new.user@example.com',
        role: UserRole.EMPLOYEE,
        passwordHash: expect.any(String),
      }),
    );
    expect(result.user.email).toBe('new.user@example.com');
    expect(result.token).toBeTruthy();
    expect(result.expiresIn).toBe('30m');
  });

  it('rejects registration when email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue(createUser());

    await expect(
      authService.register('Another User', 'john@example.com', 'Password123!'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects expired or invalid tokens', () => {
    expect(() => authService.verifyAccessToken('not-a-real-token')).toThrow(UnauthorizedException);
  });

  it('verifies a valid access token', () => {
    const token = jwt.sign(
      {
        sub: '507f1f77bcf86cd799439011',
        email: 'john@example.com',
        role: UserRole.EMPLOYEE,
      },
      env.JWT_SECRET,
      { expiresIn: '30m' },
    );

    const payload = authService.verifyAccessToken(token);

    expect(payload.sub).toBe('507f1f77bcf86cd799439011');
    expect(payload.email).toBe('john@example.com');
    expect(payload.role).toBe(UserRole.EMPLOYEE);
  });
});
