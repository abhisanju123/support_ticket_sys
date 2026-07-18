import { isValidObjectId, Types } from 'mongoose';

import { ValidationException } from '../../exceptions/index.js';
import type { ObjectId } from '../../types/domain.types.js';

/**
 * Base class for application services.
 * Extend for shared service behavior as the project grows.
 */
export abstract class BaseService {
  protected toObjectId(id: string | ObjectId): ObjectId {
    if (!isValidObjectId(id)) {
      throw new ValidationException('Invalid identifier');
    }

    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }
}
