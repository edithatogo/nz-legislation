import { z } from 'zod';

export const CanonicalUriSchema = z.string().min(1);
export type CanonicalUri = z.infer<typeof CanonicalUriSchema>;

export const CanonicalDocumentTypeSchema = z.enum(['act', 'bill', 'regulation', 'instrument']);
export type CanonicalDocumentType = z.infer<typeof CanonicalDocumentTypeSchema>;

export const CanonicalLifecycleStateSchema = z.enum([
  'draft',
  'not-yet-in-force',
  'in-force',
  'partially-in-force',
  'amended',
  'repealed',
  'withdrawn',
  'superseded',
  'unknown',
]);
export type CanonicalLifecycleState = z.infer<typeof CanonicalLifecycleStateSchema>;

export const CanonicalManifestationFormatSchema = z.enum([
  'html',
  'pdf',
  'xml',
  'json',
  'docx',
  'text',
  'other',
]);
export type CanonicalManifestationFormat = z.infer<typeof CanonicalManifestationFormatSchema>;

export const CanonicalRelationshipTypeSchema = z.enum([
  'amends',
  'amended_by',
  'repeals',
  'repealed_by',
  'commences',
  'commenced_by',
  'derived_from',
  'supersedes',
  'has_expression',
  'has_manifestation',
]);
export type CanonicalRelationshipType = z.infer<typeof CanonicalRelationshipTypeSchema>;

export const CanonicalCitationSchema = z.object({
  preferred: z.string().min(1),
  neutral: z.string().min(1).optional(),
  short: z.string().min(1).optional(),
});
export type CanonicalCitation = z.infer<typeof CanonicalCitationSchema>;

export const CanonicalSourceReferenceSchema = z.object({
  sourceSystem: z.string().min(1),
  sourceId: z.string().min(1),
  sourceUrl: z.string().url().optional(),
});
export type CanonicalSourceReference = z.infer<typeof CanonicalSourceReferenceSchema>;

export const CanonicalWorkSchema = z.object({
  canonicalId: z.string().min(1),
  workUri: CanonicalUriSchema,
  source: CanonicalSourceReferenceSchema,
  jurisdictionCode: z.string().min(1),
  documentType: CanonicalDocumentTypeSchema,
  title: z.string().min(1),
  shortTitle: z.string().optional(),
  language: z.string().min(2).default('en'),
  preferredCitation: z.string().min(1).optional(),
  neutralCitation: z.string().min(1).optional(),
});
export type CanonicalWork = z.infer<typeof CanonicalWorkSchema>;

export const CanonicalExpressionSchema = z.object({
  expressionUri: CanonicalUriSchema,
  workUri: CanonicalUriSchema,
  expressionDate: z.string().date().optional(),
  publicationDate: z.string().date().optional(),
  commencementDate: z.string().date().optional(),
  inForceDate: z.string().date().optional(),
  repealDate: z.string().date().optional(),
  lifecycleState: CanonicalLifecycleStateSchema,
  isCurrent: z.boolean(),
  versionLabel: z.string().optional(),
  language: z.string().min(2).default('en'),
});
export type CanonicalExpression = z.infer<typeof CanonicalExpressionSchema>;

export const CanonicalManifestationSchema = z.object({
  manifestationUri: CanonicalUriSchema,
  expressionUri: CanonicalUriSchema,
  format: CanonicalManifestationFormatSchema,
  mediaType: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  hash: z.string().optional(),
  retrievedAt: z.string().datetime().optional(),
});
export type CanonicalManifestation = z.infer<typeof CanonicalManifestationSchema>;

export const CanonicalRelationshipSchema = z.object({
  subjectUri: CanonicalUriSchema,
  relationshipType: CanonicalRelationshipTypeSchema,
  objectUri: CanonicalUriSchema,
  note: z.string().optional(),
});
export type CanonicalRelationship = z.infer<typeof CanonicalRelationshipSchema>;

export const CanonicalLegislationRecordSchema = z.object({
  work: CanonicalWorkSchema,
  expressions: z.array(CanonicalExpressionSchema),
  manifestations: z.array(CanonicalManifestationSchema),
  relationships: z.array(CanonicalRelationshipSchema).default([]),
  citations: CanonicalCitationSchema.optional(),
});
export type CanonicalLegislationRecord = z.infer<typeof CanonicalLegislationRecordSchema>;
