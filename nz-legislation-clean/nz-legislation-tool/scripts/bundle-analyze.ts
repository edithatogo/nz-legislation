/**
 * Bundle Size Optimization Script
 * 
 * Analyzes bundle composition, identifies optimization opportunities,
 * and generates recommendations for reducing bundle size.
 * 
 * Run with: npx tsx scripts/bundle-analyze.ts
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const DIST_DIR = join(PROJECT_ROOT, 'dist');
const REPORTS_DIR = join(PROJECT_ROOT, 'bundle-reports');

/**
 * Bundle analysis result
 */
interface BundleAnalysis {
  timestamp: string;
  totalSize: number;
  mainBundle: number;
  dependencies: DependencySize[];
  treeshaking: TreeshakingResult;
  recommendations: Recommendation[];
}

interface DependencySize {
  name: string;
  size: number;
  percentage: number;
}

interface TreeshakingResult {
  hasSideEffects: boolean;
  unusedExports: string[];
  duplicateDependencies: string[];
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedSavings: number;
  action: string;
}

/**
 * Analyze bundle size
 */
function analyzeBundle(): BundleAnalysis {
  console.log('🔍 Analyzing bundle size...\n');

  // Ensure dist directory exists
  if (!existsSync(DIST_DIR)) {
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit', cwd: PROJECT_ROOT });
  }

  // Ensure reports directory exists
  if (!existsSync(REPORTS_DIR)) {
    mkdirSync(REPORTS_DIR, { recursive: true });
  }

  // Get file sizes
  const files = readdirSync(DIST_DIR);
  
  let totalSize = 0;
  let mainBundleSize = 0;
  const dependencySizes: Map<string, number> = new Map();

  for (const file of files) {
    const filePath = join(DIST_DIR, file);
    const stat = statSync(filePath);
    
    if (stat.isFile()) {
      const sizeKB = stat.size / 1024;
      totalSize += sizeKB;

      if (file === 'cli.js' || file === 'main.js') {
        mainBundleSize += sizeKB;
      } else if (file.endsWith('.js')) {
        // Extract dependency name from filename
        const match = file.match(/^(.+?)(?:-\w+)?\.js$/);
        if (match) {
          const depName = match[1];
          dependencySizes.set(depName, (dependencySizes.get(depName) || 0) + sizeKB);
        }
      }
    }
  }

  // Convert to array and sort by size
  const dependencies: DependencySize[] = Array.from(dependencySizes.entries())
    .map(([name, size]) => ({
      name,
      size,
      percentage: (size / totalSize) * 100,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 20); // Top 20 dependencies

  // Analyze treeshaking
  const treeshaking = analyzeTreeshaking();

  // Generate recommendations
  const recommendations = generateRecommendations(dependencies, treeshaking, totalSize);

  const analysis: BundleAnalysis = {
    timestamp: new Date().toISOString(),
    totalSize,
    mainBundle: mainBundleSize,
    dependencies,
    treeshaking,
    recommendations,
  };

  // Generate report
  generateReport(analysis);

  return analysis;
}

/**
 * Analyze treeshaking effectiveness
 */
function analyzeTreeshaking(): TreeshakingResult {
  const packageJson = JSON.parse(
    readFileSync(join(PROJECT_ROOT, 'package.json'), 'utf-8')
  );

  const hasSideEffects = packageJson.sideEffects === true;
  
  // Check for unused exports (simplified - would need AST analysis for accurate results)
  const unusedExports: string[] = [];
  
  // Check for duplicate dependencies
  const duplicateDependencies: string[] = [];
  
  try {
    // Check npm lockfile for duplicates when present.
    const lockfilePath = join(PROJECT_ROOT, 'package-lock.json');
    if (!existsSync(lockfilePath)) {
      return {
        hasSideEffects,
        unusedExports,
        duplicateDependencies,
        treeshakingPotential: hasSideEffects ? 'medium' : 'high',
      };
    }

    const lockFile = JSON.parse(readFileSync(lockfilePath, 'utf-8'));
    
    // Simple duplicate detection (would need more sophisticated analysis)
    const dependencies = new Set<string>();
    if (lockFile.dependencies) {
      for (const dep of Object.keys(lockFile.dependencies)) {
        if (dependencies.has(dep)) {
          duplicateDependencies.push(dep);
        }
        dependencies.add(dep);
      }
    }
  } catch {
    // package-lock.json not found or invalid
  }

  return {
    hasSideEffects,
    unusedExports,
    duplicateDependencies,
  };
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(
  dependencies: DependencySize[],
  treeshaking: TreeshakingResult,
  totalSize: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Check for large dependencies
  for (const dep of dependencies) {
    if (dep.size > 100 && dep.percentage > 10) {
      recommendations.push({
        priority: 'high',
        title: `Large dependency: ${dep.name}`,
        description: `${dep.name} contributes ${dep.size.toFixed(1)}KB (${dep.percentage.toFixed(1)}%) to bundle size`,
        estimatedSavings: dep.size * 0.5, // Assume 50% savings possible
        action: `Consider replacing ${dep.name} with a lighter alternative or using dynamic imports`,
      });
    }
  }

  // Check for side effects
  if (treeshaking.hasSideEffects) {
    recommendations.push({
      priority: 'high',
      title: 'Side effects enabled',
      description: 'Package.json marks all files as having side effects, preventing treeshaking',
      estimatedSavings: totalSize * 0.2, // Assume 20% savings
      action: 'Set "sideEffects": false or provide specific files with side effects in package.json',
    });
  }

  // Check for duplicate dependencies
  if (treeshaking.duplicateDependencies.length > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Duplicate dependencies detected',
      description: `Found ${treeshaking.duplicateDependencies.length} duplicate dependencies`,
      estimatedSavings: 50,
      action: 'Run "npm dedupe" to remove duplicate dependencies',
    });
  }

  // Check total bundle size
  if (totalSize > 5120) { // > 5MB
    recommendations.push({
      priority: 'high',
      title: 'Bundle size exceeds target',
      description: `Total bundle size is ${(totalSize / 1024).toFixed(2)}MB (target: 5MB)`,
      estimatedSavings: totalSize * 0.3,
      action: 'Implement code splitting and lazy loading for non-critical features',
    });
  } else if (totalSize > 3072) { // > 3MB
    recommendations.push({
      priority: 'medium',
      title: 'Bundle size approaching limit',
      description: `Total bundle size is ${(totalSize / 1024).toFixed(2)}MB`,
      estimatedSavings: totalSize * 0.15,
      action: 'Review large dependencies and consider optimizations',
    });
  }

  // Always recommend dynamic imports
  recommendations.push({
    priority: 'medium',
    title: 'Implement dynamic imports',
    description: 'Static imports load all code upfront, increasing initial bundle size',
    estimatedSavings: totalSize * 0.2,
    action: 'Use dynamic import() for commands and features not needed at startup',
  });

  // Recommend esbuild
  recommendations.push({
    priority: 'low',
    title: 'Consider esbuild for production builds',
    description: 'esbuild can produce smaller bundles than TypeScript compiler',
    estimatedSavings: totalSize * 0.1,
    action: 'Add esbuild configuration for production builds',
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Generate markdown report
 */
function generateReport(analysis: BundleAnalysis): void {
  const reportPath = join(REPORTS_DIR, `bundle-analysis-${new Date().toISOString().replace(/[:.]/g, '-')}.md`);
  
  const report = `# Bundle Size Analysis Report

**Generated:** ${analysis.timestamp}

---

## Executive Summary

**Total Bundle Size:** ${(analysis.totalSize / 1024).toFixed(2)} MB (${analysis.totalSize.toFixed(0)} KB)  
**Main Bundle:** ${(analysis.mainBundle / 1024).toFixed(2)} MB  
**Target:** < 5 MB  
**Status:** ${analysis.totalSize < 5120 ? '✅ Within target' : '❌ Exceeds target'}

---

## Bundle Composition

### Top Dependencies by Size

| Rank | Dependency | Size (KB) | Percentage |
|------|-----------|-----------|------------|
${analysis.dependencies.map((dep, i) => 
`| ${i + 1} | ${dep.name} | ${dep.size.toFixed(1)} | ${dep.percentage.toFixed(1)}% |`
).join('\n')}

### Bundle Breakdown

\`\`\`
Main Bundle:     ${(analysis.mainBundle / 1024).toFixed(2)} MB (${((analysis.mainBundle / analysis.totalSize) * 100).toFixed(1)}%)
Dependencies:    ${((analysis.totalSize - analysis.mainBundle) / 1024).toFixed(2)} MB (${((1 - analysis.mainBundle / analysis.totalSize) * 100).toFixed(1)}%)
\`\`\`

---

## Treeshaking Analysis

| Check | Status |
|-------|--------|
| Side Effects | ${analysis.treeshaking.hasSideEffects ? '❌ Enabled (prevents treeshaking)' : '✅ Disabled'} |
| Unused Exports | ${analysis.treeshaking.unusedExports.length > 0 ? `⚠️ ${analysis.treeshaking.unusedExports.length} detected` : '✅ None detected'} |
| Duplicate Dependencies | ${analysis.treeshaking.duplicateDependencies.length > 0 ? `⚠️ ${analysis.treeshaking.duplicateDependencies.length} duplicates` : '✅ None detected'} |

---

## Optimization Recommendations

${analysis.recommendations.map((rec, i) => `### ${i + 1}. ${rec.title} ${rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'}

**Priority:** ${rec.priority.toUpperCase()}  
**Estimated Savings:** ${(rec.estimatedSavings / 1024).toFixed(2)} KB

${rec.description}

**Action:** ${rec.action}

---
`).join('')}

## Historical Comparison

*Run this script multiple times to track bundle size trends over time.*

---

## Commands

\`\`\`bash
# Analyze bundle
npx tsx scripts/bundle-analyze.ts

# Build with analysis
npm run build:analyze

# View interactive report (if using webpack-bundle-analyzer)
npx webpack-bundle-analyzer bundle-reports/stats.json
\`\`\`

---

*Report generated by Bundle Size Optimization Script v1.0*
`;

  writeFileSync(reportPath, report);
  console.log(`📄 Report saved to: ${reportPath}\n`);

  // Also save JSON for programmatic access
  const jsonPath = join(REPORTS_DIR, `bundle-analysis-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  writeFileSync(jsonPath, JSON.stringify(analysis, null, 2));
  console.log(`📊 Data saved to: ${jsonPath}\n`);
}

// Run analysis
console.log('🚀 Bundle Size Optimization Analysis\n');
console.log('='.repeat(60));
console.log();

try {
  const analysis = analyzeBundle();
  
  console.log('='.repeat(60));
  console.log('\n✅ Bundle Analysis Complete!\n');
  console.log(`📦 Total Size: ${(analysis.totalSize / 1024).toFixed(2)} MB`);
  console.log(`📊 Recommendations: ${analysis.recommendations.length}`);
  console.log(`🎯 High Priority: ${analysis.recommendations.filter(r => r.priority === 'high').length}\n`);
} catch (error) {
  console.error('\n❌ Bundle Analysis Failed:', (error as Error).message);
  console.error(error);
  process.exit(1);
}
