import { describe, it, expect, beforeEach } from 'vitest';
import { getGlobalRegistry, initializeProviders } from '../src/providers/index.js';

describe('Jurisdiction Routing', () => {
  beforeEach(() => {
    initializeProviders({
      commonwealthApiKey: 'test-cth-key',
      queenslandApiKey: 'test-qld-key',
    });
  });

  it('should have all providers registered', () => {
    const registry = getGlobalRegistry();
    const jurisdictions = registry.getJurisdictions();
    
    expect(jurisdictions).toContain('nz');
    expect(jurisdictions).toContain('au-comm');
    expect(jurisdictions).toContain('au-qld');
  });

  it('should return correct provider for jurisdiction', () => {
    const registry = getGlobalRegistry();
    
    const nzProvider = registry.get('nz');
    expect(nzProvider?.getJurisdiction()).toBe('nz');
    expect(nzProvider?.getDisplayName()).toBe('New Zealand');
    
    const cthProvider = registry.get('au-comm');
    expect(cthProvider?.getJurisdiction()).toBe('au-comm');
    
    const qldProvider = registry.get('au-qld');
    expect(qldProvider?.getJurisdiction()).toBe('au-qld');
  });

  it('should handle unknown jurisdictions', () => {
    const registry = getGlobalRegistry();
    expect(registry.get('unknown')).toBeUndefined();
  });
});
