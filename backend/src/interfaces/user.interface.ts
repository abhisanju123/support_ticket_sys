import type { UserRole } from '../enums/user-role.enum.js';
import type { ObjectId } from '../types/domain.types.js';

/** Core user fields stored in MongoDB. */
export interface IUser {
  name: string;
  email: string;
  role: UserRole;
  passwordHash?: string;
}

/** Full persisted user document including id and timestamps. */
export interface IUserRecord extends IUser {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
