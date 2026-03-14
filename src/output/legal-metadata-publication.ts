import type { CanonicalLegislationRecord } from '../models/canonical.js';

type SchemaOrgLegislation = {
  '@context': 'https://schema.org';
  '@type': 'Legislation';
  name: string;
  legislationType: string;
  legislationIdentifier: string;
  jurisdiction?: string;
  inLanguage?: string;
  url?: string;
  datePublished?: string;
  legislationDate?: string;
  isBasedOn?: string;
  sameAs?: string[];
  creativeWorkStatus?: string;
};

export function toSchemaOrgLegislation(record: CanonicalLegislationRecord): SchemaOrgLegislation {
  const currentExpression =
    record.expressions.find(expression => expression.isCurrent) ?? record.expressions[0];
  const primaryManifestation =
    record.manifestations.find(
      manifestation => manifestation.expressionUri === currentExpression?.expressionUri
    ) ?? record.manifestations[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Legislation',
    name: record.work.title,
    legislationType: record.work.documentType,
    legislationIdentifier: record.work.canonicalId,
    jurisdiction: record.work.jurisdictionCode,
    inLanguage: currentExpression?.language ?? record.work.language,
    url: primaryManifestation?.sourceUrl ?? record.work.source.sourceUrl,
    datePublished: currentExpression?.publicationDate,
    legislationDate: currentExpression?.expressionDate,
    isBasedOn: record.work.source.sourceUrl,
    sameAs: [
      record.work.workUri,
      ...(currentExpression ? [currentExpression.expressionUri] : []),
      ...record.manifestations.map(manifestation => manifestation.manifestationUri),
    ],
    creativeWorkStatus: currentExpression?.lifecycleState,
  };
}
