/**
 * Jurisdiction provider routing for the active package.
 *
 * NZ remains the only implemented provider in the current codebase. Other
 * jurisdictions are surfaced explicitly so the `next` lane can evolve without
 * implying release-ready support that does not exist yet.
 */

import { getWork, getWorkVersions, searchWorks } from '../client.js';
import type { SearchResults, Version, Work } from '../models/index.js';

export const SUPPORTED_JURISDICTIONS = ['nz', 'au-comm', 'au-qld'] as const;
export type Jurisdiction = (typeof SUPPORTED_JURISDICTIONS)[number];

interface SearchLegislationParams {
  jurisdiction?: Jurisdiction;
  query?: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

interface GetLegislationParams {
  jurisdiction?: Jurisdiction;
  workId: string;
}

function assertJurisdictionImplemented(jurisdiction: Jurisdiction): asserts jurisdiction is 'nz' {
  if (jurisdiction !== 'nz') {
    throw new Error(
      `Jurisdiction '${jurisdiction}' is not implemented in this branch yet. Current supported jurisdiction: nz.`
    );
  }
}

export async function searchLegislation(
  params: SearchLegislationParams
): Promise<SearchResults> {
  const jurisdiction = params.jurisdiction ?? 'nz';
  assertJurisdictionImplemented(jurisdiction);

  return searchWorks({
    query: params.query,
    type: params.type,
    status: params.status,
    from: params.from,
    to: params.to,
    limit: params.limit,
    offset: params.offset,
  });
}

export async function getLegislation(params: GetLegislationParams): Promise<Work> {
  const jurisdiction = params.jurisdiction ?? 'nz';
  assertJurisdictionImplemented(jurisdiction);

  return getWork(params.workId);
}

export async function getLegislationVersions(params: GetLegislationParams): Promise<Version[]> {
  const jurisdiction = params.jurisdiction ?? 'nz';
  assertJurisdictionImplemented(jurisdiction);

  return getWorkVersions(params.workId);
}
