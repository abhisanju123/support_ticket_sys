import type { Schema } from 'mongoose';

import { INDEX_DEFINITIONS } from './index-definitions.js';

/**
 * Applies centralized index definitions to a Mongoose schema.
 * Keeps models and INDEX_DEFINITIONS in sync.
 */
export const applySchemaIndexes = (schema: Schema, collectionName: string): void => {
  const definitions = INDEX_DEFINITIONS[collectionName];

  if (!definitions) {
    return;
  }

  for (const { keys, options } of definitions) {
    schema.index(keys, options);
  }
};
