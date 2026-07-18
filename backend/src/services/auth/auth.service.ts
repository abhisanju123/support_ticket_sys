import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { API_MESSAGES } from '../../constants/index.js';
import { UserRole } from '../../enums/user-role.enum.js';
import { ConflictException, NotFoundException, UnauthorizedException } from '../../exceptions/index.js';
import type { IUserRecord } from '../../interfaces/user.interface.js';
import type { IUserRepository } from '../../repositories/interfaces/user.repository.interface.js';
import type { AuthUserResponse, JwtAccessTokenPayload, LoginResult } from '../../types/auth.types.js';

const PASSWORD_SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
};

export const comparePassword = async (password: string, passwordHash: string): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};

const toAuthUser = (user: IUserRecord): AuthUserResponse => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException(API_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException(API_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = this.signAccessToken(user);

    return {
      user: toAuthUser(user),
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  async register(name: string, email: string, password: string): Promise<LoginResult> {
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException(API_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(password);
    const user = await this.userRepository.create({
      name: trimmedName,
      email: normalizedEmail,
      role: UserRole.EMPLOYEE,
      passwordHash,
    });

    const token = this.signAccessToken(user);

    return {
      user: toAuthUser(user),
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  async getUserProfile(userId: string): Promise<AuthUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toAuthUser(user);
  }

  verifyAccessToken(token: string): JwtAccessTokenPayload {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtAccessTokenPayload;

      if (!payload?.sub || !payload.email || !payload.role) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private signAccessToken(user: IUserRecord): string {
    const payload: JwtAccessTokenPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }
}
