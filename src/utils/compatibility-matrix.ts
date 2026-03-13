/**
 * Compatibility Matrix
 *
 * Tracks which plugin versions are compatible with which core versions.
 * Prevents version conflicts and helps users upgrade safely.
 */

export interface VersionRange {
  min?: string;
  max?: string;
  exact?: string;
}

export interface CompatibilityInfo {
  plugin: string;
  version: string;
  coreVersion: VersionRange;
  compatible: boolean;
  notes?: string;
}

export interface PluginCompatibility {
  name: string;
  version: string;
  requires: {
    core: string;
    plugins?: Record<string, string>;
  };
  provides?: string[];
}

export class CompatibilityMatrix {
  private compatibilityData: Map<string, CompatibilityInfo[]> = new Map();
  private currentCoreVersion: string;

  constructor(coreVersion: string) {
    this.currentCoreVersion = coreVersion;
  }

  /**
   * Register plugin compatibility info
   */
  register(info: PluginCompatibility): void {
    const compatibilityInfo: CompatibilityInfo = {
      plugin: info.name,
      version: info.version,
      coreVersion: this.parseVersionRange(info.requires.core),
      compatible: this.isVersionCompatible(this.currentCoreVersion, info.requires.core),
      notes: this.getCompatibilityNotes(info.requires.core),
    };

    if (!this.compatibilityData.has(info.name)) {
      this.compatibilityData.set(info.name, []);
    }

    this.compatibilityData.get(info.name)!.push(compatibilityInfo);
  }

  /**
   * Check if plugin is compatible with current core version
   */
  check(plugin: string, version: string): boolean {
    const infos = this.compatibilityData.get(plugin);

    if (!infos || infos.length === 0) {
      console.warn(`No compatibility info for ${plugin}@${version}`);
      return true; // Assume compatible if no info
    }

    const info = infos.find(i => i.version === version);

    if (!info) {
      console.warn(`No compatibility info for ${plugin}@${version}`);
      return true;
    }

    return info.compatible;
  }

  /**
   * Get compatible plugins
   */
  getCompatiblePlugins(): CompatibilityInfo[] {
    const result: CompatibilityInfo[] = [];

    for (const infos of this.compatibilityData.values()) {
      const compatible = infos.filter(i => i.compatible);
      if (compatible.length > 0) {
        result.push(...compatible);
      }
    }

    return result;
  }

  /**
   * Get incompatible plugins
   */
  getIncompatiblePlugins(): CompatibilityInfo[] {
    const result: CompatibilityInfo[] = [];

    for (const infos of this.compatibilityData.values()) {
      const incompatible = infos.filter(i => !i.compatible);
      if (incompatible.length > 0) {
        result.push(...incompatible);
      }
    }

    return result;
  }

  /**
   * Warn on incompatibility
   */
  warnOnIncompatibility(plugin: string, version: string): void {
    if (!this.check(plugin, version)) {
      const info = this.compatibilityData.get(plugin)?.find(i => i.version === version);

      console.warn(
        `⚠️ Plugin ${plugin}@${version} is not compatible with core v${this.currentCoreVersion}.` +
          `Required: ${info?.coreVersion.exact ?? 'unknown'}. ` +
          `Please update the plugin or downgrade core.`
      );
    }
  }

  /**
   * Get compatibility report
   */
  getReport(): {
    coreVersion: string;
    totalPlugins: number;
    compatible: number;
    incompatible: number;
    plugins: CompatibilityInfo[];
  } {
    const allPlugins = Array.from(this.compatibilityData.values()).flat();
    const compatible = allPlugins.filter(p => p.compatible);
    const incompatible = allPlugins.filter(p => !p.compatible);

    return {
      coreVersion: this.currentCoreVersion,
      totalPlugins: this.compatibilityData.size,
      compatible: compatible.length,
      incompatible: incompatible.length,
      plugins: allPlugins,
    };
  }

  /**
   * Parse version range string (e.g., "^2.0.0", ">=2.0.0 <3.0.0")
   */
  private parseVersionRange(range: string): VersionRange {
    // Simple parsing - supports ^, >=, <, exact
    if (range.startsWith('^')) {
      const min = range.substring(1);
      const major = min.split('.')[0];
      return { min, max: `${parseInt(major) + 1}.0.0` };
    }

    if (range.startsWith('>=')) {
      const parts = range.split(' ');
      return {
        min: parts[0].substring(2),
        max: parts[1]?.startsWith('<') ? parts[1].substring(1) : undefined,
      };
    }

    // Exact version
    return { exact: range };
  }

  /**
   * Check if version matches range
   */
  private isVersionCompatible(version: string, range: string): boolean {
    const parsed = this.parseVersionRange(range);

    if (parsed.exact) {
      return version === parsed.exact;
    }

    const versionParts = version.split('.').map(Number);

    if (parsed.min) {
      const minParts = parsed.min.split('.').map(Number);
      if (this.compareVersions(versionParts, minParts) < 0) {
        return false;
      }
    }

    if (parsed.max) {
      const maxParts = parsed.max.split('.').map(Number);
      if (this.compareVersions(versionParts, maxParts) >= 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Compare two version arrays
   */
  private compareVersions(a: number[], b: number[]): number {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const aPart = a[i] ?? 0;
      const bPart = b[i] ?? 0;

      if (aPart !== bPart) {
        return aPart - bPart;
      }
    }

    return 0;
  }

  /**
   * Get compatibility notes
   */
  private getCompatibilityNotes(range: string): string {
    if (range.startsWith('^')) {
      return `Requires core version ${range}`;
    }

    if (range.startsWith('>=')) {
      return `Requires core version ${range}`;
    }

    return `Requires core version ${range} exactly`;
  }

  /**
   * Format compatibility report for CLI
   */
  formatReport(): string {
    const report = this.getReport();

    const lines = [
      `Compatibility Report`,
      `Core Version: v${report.coreVersion}`,
      `Total Plugins: ${report.totalPlugins}`,
      `Compatible: ${report.compatible}`,
      `Incompatible: ${report.incompatible}`,
      '',
    ];

    if (report.incompatible > 0) {
      lines.push('⚠️ Incompatible Plugins:');
      for (const plugin of report.plugins.filter(p => !p.compatible)) {
        lines.push(`  - ${plugin.plugin}@${plugin.version}: ${plugin.notes}`);
      }
      lines.push('');
    }

    lines.push('✅ Compatible Plugins:');
    for (const plugin of report.plugins.filter(p => p.compatible)) {
      lines.push(`  - ${plugin.plugin}@${plugin.version}`);
    }

    return lines.join('\n');
  }
}

/**
 * Check plugin compatibility before installation
 */
export async function checkPluginCompatibility(
  plugin: string,
  version: string,
  coreVersion: string
): Promise<{ compatible: boolean; message: string }> {
  // In real implementation, this would fetch compatibility info from registry
  // For now, simple version check

  const matrix = new CompatibilityMatrix(coreVersion);

  // Simulate registration
  matrix.register({
    name: plugin,
    version,
    requires: {
      core: `^${coreVersion.split('.')[0]}.0.0`, // Same major version
    },
  });

  const isCompatible = matrix.check(plugin, version);

  return {
    compatible: isCompatible,
    message: isCompatible
      ? `${plugin}@${version} is compatible with core v${coreVersion}`
      : `${plugin}@${version} is NOT compatible with core v${coreVersion}`,
  };
}
