import { isValidObjectId } from 'mongoose';

import type { IUserRecord } from '../interfaces/user.interface.js';
import type { ObjectId } from '../types/domain.types.js';
import { User } from '../models/user.model.js';
import { BaseRepository } from './base/base.repository.js';
import type { IUserRepository } from './interfaces/user.repository.interface.js';

export class UserRepository extends BaseRepository<IUserRecord> implements IUserRepository {
  constructor() {
    super(User, 'User');
  }

  async findByEmail(email: string): Promise<IUserRecord | null> {
    const normalizedEmail = email.toLowerCase().trim();
    return this.findOne({ email: normalizedEmail });
  }

  async findByEmailWithPassword(email: string): Promise<IUserRecord | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash').lean();

    if (!user) {
      return null;
    }

    return user as IUserRecord;
  }

  async existsById(id: string | ObjectId): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }

    return this.exists({ _id: id });
  }
}
