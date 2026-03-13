/**
 * Unit tests for output formatters
 */

import { describe, it, expect, vi } from 'vitest';
import { printTable, printWorkDetail, printVersionsTable } from '../src/output/index.js';

describe('Output Formatters', () => {
  const mockLog = vi.spyOn(console, 'log').mockImplementation(() => {});

  it('should print an empty results message', () => {
    printTable({ total: 0, results: [], limit: 25, offset: 0 });
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('No results found'));
  });

  it('should print search results table', () => {
    const results = {
      total: 1,
      results: [{
        id: 'test-id',
        title: 'Test Title',
        type: 'act',
        status: 'in-force',
        date: '2020-01-01',
        url: 'http://test',
        versionCount: 1
      }],
      limit: 25,
      offset: 0
    };
    printTable(results);
    expect(mockLog).toHaveBeenCalled();
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('test-id'));
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('Test Title'));
  });

  it('should print work details', () => {
    const work = {
      id: 'test-id',
      title: 'Test Title',
      shortTitle: 'Short',
      type: 'act',
      status: 'in-force',
      date: '2020-01-01',
      url: 'http://test',
      versionCount: 5,
      versions: [],
      citations: {}
    };
    printWorkDetail(work as any);
    expect(mockLog).toHaveBeenCalled();
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('test-id'));
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('Short'));
  });

  it('should print versions table', () => {
    const versions = [
      { id: 'v1', version: 1, date: '2020-01-01', type: 'act', isCurrent: false, formats: ['xml'] },
      { id: 'v2', version: 2, date: '2021-01-01', type: 'act', isCurrent: true, formats: ['xml', 'pdf'] }
    ];
    printVersionsTable(versions as any);
    expect(mockLog).toHaveBeenCalled();
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('v1'));
    expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('v2'));
  });
});
