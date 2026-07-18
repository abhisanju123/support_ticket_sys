import {
  isValidObjectId,
  Types,
  type Model,
  type QueryFilter,
  type UpdateQuery,
} from 'mongoose';

import type { ObjectId } from '../../types/domain.types.js';
import { RepositoryError } from '../errors/repository.error.js';
import type {
  FindAllOptions,
  RepositoryCreateInput,
  RepositoryUpdateInput,
} from '../types/repository.types.js';

/**
 * Generic base repository encapsulating common Mongoose operations.
 * Feature repositories extend this class and pass their model via constructor.
 */
export abstract class BaseRepository<TRecord extends { _id: ObjectId }> {
  protected readonly model: Model<TRecord>;

  protected readonly modelName: string;

  protected constructor(model: Model<TRecord>, modelName: string) {
    this.model = model;
    this.modelName = modelName;
  }

  async create(data: RepositoryCreateInput<TRecord>): Promise<TRecord> {
    try {
      const document = await this.model.create(data as UpdateQuery<TRecord>);
      return this.toDomain(document) as TRecord;
    } catch (error) {
      throw this.handleError(error, 'create');
    }
  }

  async findById(id: string | ObjectId): Promise<TRecord | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    try {
      const document = await this.model.findById(id).lean<TRecord>().exec();
      return document ?? null;
    } catch (error) {
      throw this.handleError(error, 'findById');
    }
  }

  async findOne(filter: QueryFilter<TRecord>): Promise<TRecord | null> {
    try {
      const document = await this.model.findOne(filter).lean<TRecord>().exec();
      return document ?? null;
    } catch (error) {
      throw this.handleError(error, 'findOne');
    }
  }

  async findAll(options: FindAllOptions = {}): Promise<TRecord[]> {
    const { filter = {}, sort, skip, limit, projection } = options;

    try {
      let query = this.model.find(filter as QueryFilter<TRecord>);

      if (projection) {
        query = query.select(projection);
      }

      if (sort) {
        query = query.sort(sort);
      }

      if (skip !== undefined) {
        query = query.skip(skip);
      }

      if (limit !== undefined) {
        query = query.limit(limit);
      }

      return await query.lean<TRecord[]>().exec();
    } catch (error) {
      throw this.handleError(error, 'findAll');
    }
  }

  async updateById(
    id: string | ObjectId,
    data: RepositoryUpdateInput<TRecord>,
  ): Promise<TRecord | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    try {
      const document = await this.model
        .findByIdAndUpdate(id, data as UpdateQuery<TRecord>, {
          new: true,
          runValidators: true,
        })
        .lean<TRecord>()
        .exec();

      return document ?? null;
    } catch (error) {
      throw this.handleError(error, 'updateById');
    }
  }

  async deleteById(id: string | ObjectId): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }

    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      throw this.handleError(error, 'deleteById');
    }
  }

  async exists(filter: QueryFilter<TRecord>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter).exec();
      return result !== null;
    } catch (error) {
      throw this.handleError(error, 'exists');
    }
  }

  async count(filter: QueryFilter<TRecord> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      throw this.handleError(error, 'count');
    }
  }

  protected toDomain(document: unknown): TRecord | null {
    if (!document) {
      return null;
    }

    if (
      typeof document === 'object' &&
      document !== null &&
      'toObject' in document &&
      typeof document.toObject === 'function'
    ) {
      return document.toObject() as TRecord;
    }

    return document as TRecord;
  }

  protected toDomainList(documents: unknown[]): TRecord[] {
    return documents
      .map((document) => this.toDomain(document))
      .filter((document): document is TRecord => document !== null);
  }

  protected toObjectId(id: string | ObjectId): ObjectId {
    if (!isValidObjectId(id)) {
      throw new RepositoryError(`Invalid ObjectId: ${String(id)}`, 'INVALID_OBJECT_ID');
    }

    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }

  protected handleError(error: unknown, operation: string): RepositoryError {
    if (error instanceof RepositoryError) {
      return error;
    }

    if (this.isDuplicateKeyError(error)) {
      return new RepositoryError(
        `${this.modelName} duplicate key violation`,
        'DUPLICATE_KEY',
        error,
      );
    }

    if (error instanceof Error && error.name === 'ValidationError') {
      return new RepositoryError(error.message, 'VALIDATION_ERROR', error);
    }

    if (error instanceof Error && error.name === 'CastError') {
      return new RepositoryError('Invalid data format', 'CAST_ERROR', error);
    }

    const message = error instanceof Error ? error.message : 'Unknown database error';

    return new RepositoryError(
      `${this.modelName} ${operation} failed: ${message}`,
      'DATABASE_ERROR',
      error,
    );
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    );
  }
}
