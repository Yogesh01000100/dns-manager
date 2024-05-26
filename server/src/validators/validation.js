import { z } from 'zod';

export const recordSchema = z.object({
  name: z.string(),
  type: z.string(),
  value: z.string().optional(),
  ttl: z.number(),
  zoneId: z.string(),
});

export const updateRecordSchema = z.object({
  recordId: z.string(),
  name: z.string(),
  type: z.string(),
  values: z.array(z.string()).or(z.string()),
  ttl: z.number(),
  zoneId: z.string(),
});

export const deleteRecordSchema = z.object({
  recordId: z.string(),
  zoneId: z.string(),
});
