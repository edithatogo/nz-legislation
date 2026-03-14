import type {
  CanonicalLegislationRecord,
  CanonicalLifecycleState,
  CanonicalManifestation,
  CanonicalRelationship,
  CanonicalWork,
  CanonicalExpression,
} from '../models/canonical.js';

import type { VersionSummary, Work } from './legislation-provider.js';

function encodeIdPart(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildWorkUri(jurisdiction: string, workId: string): string {
  return `urn:nz-legislation:work:${encodeIdPart(jurisdiction)}:${encodeIdPart(workId)}`;
}

function buildExpressionUri(workUri: string, versionId: string): string {
  return `${workUri}:expression:${encodeIdPart(versionId)}`;
}

function buildManifestationUri(expressionUri: string, format: string): string {
  return `${expressionUri}:manifestation:${encodeIdPart(format)}`;
}

function deriveSourceSystem(jurisdiction: string): string {
  switch (jurisdiction) {
    case 'nz':
      return 'nz-legislation-api';
    case 'au-comm':
      return 'federal-register-of-legislation';
    case 'au-qld':
      return 'queensland-legislation-api';
    default:
      return 'unknown-legislation-source';
  }
}

function deriveDocumentType(type: string): CanonicalWork['documentType'] {
  switch (type) {
    case 'act':
    case 'bill':
    case 'regulation':
    case 'instrument':
      return type;
    default:
      return 'instrument';
  }
}

function deriveLifecycleState(status?: string): CanonicalLifecycleState {
  switch (status) {
    case 'in-force':
      return 'in-force';
    case 'not-yet-in-force':
      return 'not-yet-in-force';
    case 'partially-repealed':
      return 'amended';
    case 'repealed':
    case 'not-in-force':
      return 'repealed';
    case 'withdrawn':
      return 'withdrawn';
    default:
      return 'unknown';
  }
}

function deriveManifestationFormat(format: string): CanonicalManifestation['format'] {
  switch (format.toLowerCase()) {
    case 'html':
      return 'html';
    case 'pdf':
      return 'pdf';
    case 'xml':
      return 'xml';
    case 'json':
      return 'json';
    case 'docx':
      return 'docx';
    case 'txt':
    case 'text':
      return 'text';
    default:
      return 'other';
  }
}

function deriveMediaType(format: CanonicalManifestation['format']): string {
  switch (format) {
    case 'html':
      return 'text/html';
    case 'pdf':
      return 'application/pdf';
    case 'xml':
      return 'application/xml';
    case 'json':
      return 'application/json';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'text':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}

function buildCanonicalWork(work: Work, workUri: string): CanonicalWork {
  return {
    canonicalId: `${work.jurisdiction}:${work.work_id}`,
    workUri,
    source: {
      sourceSystem: deriveSourceSystem(work.jurisdiction),
      sourceId: work.work_id,
      sourceUrl: work.url,
    },
    jurisdictionCode: work.jurisdiction,
    documentType: deriveDocumentType(work.type),
    title: work.title,
    shortTitle: work.shortTitle,
    language: 'en',
    preferredCitation:
      work.citations.australian ?? work.citations.nzmj ?? work.citations.apa ?? work.title,
    neutralCitation: work.citations.nzmj,
  };
}

function buildExpression(
  workUri: string,
  version: VersionSummary,
  fallbackState: CanonicalLifecycleState
): CanonicalExpression {
  return {
    expressionUri: buildExpressionUri(workUri, version.version_id),
    workUri,
    expressionDate: version.date,
    publicationDate: version.date,
    lifecycleState: fallbackState,
    isCurrent: version.is_current,
    versionLabel: version.title || version.version_id,
    language: 'en',
  };
}

function buildFallbackExpression(work: Work, workUri: string): CanonicalExpression {
  return {
    expressionUri: buildExpressionUri(workUri, work.work_id),
    workUri,
    expressionDate: work.date,
    publicationDate: work.date,
    inForceDate: work.status === 'in-force' ? work.date : undefined,
    repealDate: work.status === 'repealed' ? work.date : undefined,
    lifecycleState: deriveLifecycleState(work.status),
    isCurrent: true,
    versionLabel: 'current',
    language: 'en',
  };
}

function buildManifestations(
  expressions: CanonicalExpression[],
  versions: VersionSummary[],
  workUrl?: string
): CanonicalManifestation[] {
  const manifestations: CanonicalManifestation[] = [];

  if (versions.length > 0) {
    versions.forEach((version, index) => {
      const expression = expressions[index];
      const formats = version.formats?.length ? version.formats : ['html'];

      formats.forEach(format => {
        const canonicalFormat = deriveManifestationFormat(format);
        manifestations.push({
          manifestationUri: buildManifestationUri(expression.expressionUri, format),
          expressionUri: expression.expressionUri,
          format: canonicalFormat,
          mediaType: deriveMediaType(canonicalFormat),
        });
      });
    });

    return manifestations;
  }

  const expression = expressions[0];
  manifestations.push({
    manifestationUri: buildManifestationUri(expression.expressionUri, 'html'),
    expressionUri: expression.expressionUri,
    format: 'html',
    mediaType: 'text/html',
    sourceUrl: workUrl,
  });

  return manifestations;
}

function buildRelationships(
  workUri: string,
  expressions: CanonicalExpression[],
  manifestations: CanonicalManifestation[]
): CanonicalRelationship[] {
  const relationships: CanonicalRelationship[] = [];

  expressions.forEach(expression => {
    relationships.push({
      subjectUri: workUri,
      relationshipType: 'has_expression',
      objectUri: expression.expressionUri,
    });
  });

  manifestations.forEach(manifestation => {
    relationships.push({
      subjectUri: manifestation.expressionUri,
      relationshipType: 'has_manifestation',
      objectUri: manifestation.manifestationUri,
    });
  });

  return relationships;
}

export function toCanonicalLegislationRecord(work: Work): CanonicalLegislationRecord {
  const workUri = buildWorkUri(work.jurisdiction, work.work_id);
  const lifecycleState = deriveLifecycleState(work.status);
  const expressions =
    work.versions.length > 0
      ? work.versions.map(version => buildExpression(workUri, version, lifecycleState))
      : [buildFallbackExpression(work, workUri)];
  const manifestations = buildManifestations(expressions, work.versions, work.url);

  return {
    work: buildCanonicalWork(work, workUri),
    expressions,
    manifestations,
    relationships: buildRelationships(workUri, expressions, manifestations),
    citations:
      work.citations.australian || work.citations.nzmj || work.citations.apa
        ? {
            preferred:
              work.citations.australian ?? work.citations.nzmj ?? work.citations.apa ?? work.title,
            neutral: work.citations.nzmj,
          }
        : undefined,
  };
}
