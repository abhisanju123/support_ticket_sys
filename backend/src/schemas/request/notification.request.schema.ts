import { z } from 'zod';

import { objectIdSchema } from '../common.schema.js';

export const notificationIdParamSchema = z.object({
  id: objectIdSchema,
});
