import type { ObjectId } from '../../types/domain.types.js';

export type RepositoryCreateInput<TRecord extends { _id: ObjectId }> = Omit<
  TRecord,
  '_id' | 'createdAt' | 'updatedAt'
>;

export type RepositoryUpdateInput<TRecord> = Partial<
  Omit<TRecord, '_id' | 'createdAt' | 'updatedAt'>
>;

export interface FindAllOptions {
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  projection?: Record<string, 0 | 1>;
}

export interface PaginatedResult<TRecord> {
  data: TRecord[];
  total: number;
  skip: number;
  limit: number;
}
