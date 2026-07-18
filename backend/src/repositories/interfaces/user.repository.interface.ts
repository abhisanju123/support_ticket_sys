import type { IUserRecord } from '../../interfaces/user.interface.js';
import type { UserRole } from '../../enums/user-role.enum.js';
import type { ObjectId } from '../../types/domain.types.js';
import type { FindAllOptions } from '../types/repository.types.js';

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
}

export interface IUserRepository {
  findById(id: string | ObjectId): Promise<IUserRecord | null>;
  findByEmail(email: string): Promise<IUserRecord | null>;
  findByEmailWithPassword(email: string): Promise<IUserRecord | null>;
  findAll(options?: FindAllOptions): Promise<IUserRecord[]>;
  existsById(id: string | ObjectId): Promise<boolean>;
  create(data: CreateUserInput): Promise<IUserRecord>;
}