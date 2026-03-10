/**
 * Load Testing Script with k6
 * 
 * Performance and load testing for NZ Legislation CLI API client.
 * 
 * Prerequisites:
 * - Install k6: https://k6.io/docs/getting-started/installation/
 * - Set API key: export NZ_LEGISLATION_API_KEY=your_key
 * 
 * Run with: k6 run scripts/load-test.ts
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const searchSuccessRate = new Rate('search_success_rate');
const getWorkSuccessRate = new Rate('get_work_success_rate');
const searchResponseTime = new Trend('search_response_time');
const getWorkResponseTime = new Trend('get_work_response_time');
const cacheHits = new Counter('cache_hits');
const apiCalls = new Counter('api_calls');

// Test configuration
export const options = {
  // Scenario 1: Smoke test (1 min)
  smoke: {
    executor: 'constant-vus',
    vus: 5,
    duration: '1m',
    gracefulStop: '30s',
    tags: { test_type: 'smoke' },
  },
  
  // Scenario 2: Load test (5 min)
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 20 },  // Ramp up to 20 VUs
      { duration: '3m', target: 20 },  // Stay at 20 VUs
      { duration: '1m', target: 0 },   // Ramp down
    ],
    gracefulStop: '30s',
    tags: { test_type: 'load' },
    startTime: '1m', // Start after smoke test
  },
  
  // Scenario 3: Stress test (3 min)
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 50 },  // Ramp up to 50 VUs
      { duration: '1m', target: 50 },  // Stay at 50 VUs
      { duration: '1m', target: 0 },   // Ramp down
    ],
    gracefulStop: '30s',
    tags: { test_type: 'stress' },
    startTime: '7m', // Start after load test
  },
  
  // Thresholds
  thresholds: {
    http_req_duration: ['p(50)<500', 'p(95)<1000', 'p(99)<2000'], // 50% < 500ms, 95% < 1s, 99% < 2s
    search_success_rate: ['>0.95'], // 95% success rate
    get_work_success_rate: ['>0.95'],
    search_response_time: ['avg<500', 'p(95)<1000'],
    get_work_response_time: ['avg<400', 'p(95)<800'],
  },
};

// Test data
const TEST_QUERIES = [
  'health',
  'companies',
  'resource management',
  'employment',
  'privacy',
];

const TEST_WORK_IDS = [
  'act/1986/132',  // Companies Act 1986
  'act/1989/18',   // Resource Management Act 1989
  'act/2003/34',   // Employment Relations Act 2003
  'act/1993/28',   // Privacy Act 1993
  'act/2020/3',    // COVID-19 Public Health Response Act 2020
];

// Get API key from environment
const API_KEY = __ENV.NZ_LEGISLATION_API_KEY || '';
const BASE_URL = __ENV.NZ_LEGISLATION_BASE_URL || 'https://api.legislation.govt.nz';

/**
 * Main load test function
 */
export default function () {
  if (!API_KEY) {
    console.error('API key not set. Set NZ_LEGISLATION_API_KEY environment variable.');
    return;
  }

  // Scenario 1: Search works
  searchTest();
  sleep(1);

  // Scenario 2: Get work by ID
  getWorkTest();
  sleep(1);

  // Scenario 3: Get work versions
  getVersionsTest();
  sleep(1);
}

/**
 * Search works test
 */
function searchTest() {
  const query = TEST_QUERIES[Math.floor(Math.random() * TEST_QUERIES.length)];
  const url = `${BASE_URL}/v0/works`;
  const params = {
    headers: {
      'Accept': 'application/json',
    },
    qs: {
      api_key: API_KEY,
      search_term: query,
      per_page: 20,
    },
  };

  apiCalls.add(1);
  const response = http.get(url, params);
  
  const success = check(response, {
    'search: status is 200': (r) => r.status === 200,
    'search: has results': (r) => {
      const body = JSON.parse(r.body);
      return body.results && body.results.length > 0;
    },
    'search: response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  searchSuccessRate.add(success);
  searchResponseTime.add(response.timings.duration);

  if (success) {
    // Extract work ID for subsequent tests
    const body = JSON.parse(response.body);
    if (body.results && body.results.length > 0) {
      const workId = body.results[0].work_id;
      // Store for getWork test
      return workId;
    }
  }
}

/**
 * Get work by ID test
 */
function getWorkTest() {
  const workId = TEST_WORK_IDS[Math.floor(Math.random() * TEST_WORK_IDS.length)];
  const url = `${BASE_URL}/v0/works/${workId}`;
  const params = {
    headers: {
      'Accept': 'application/json',
    },
    qs: {
      api_key: API_KEY,
    },
  };

  apiCalls.add(1);
  const response = http.get(url, params);
  
  const success = check(response, {
    'getWork: status is 200': (r) => r.status === 200,
    'getWork: has work_id': (r) => {
      const body = JSON.parse(r.body);
      return body.work_id === workId;
    },
    'getWork: response time < 800ms': (r) => r.timings.duration < 800,
  });

  getWorkSuccessRate.add(success);
  getWorkResponseTime.add(response.timings.duration);
}

/**
 * Get work versions test
 */
function getVersionsTest() {
  const workId = TEST_WORK_IDS[Math.floor(Math.random() * TEST_WORK_IDS.length)];
  const url = `${BASE_URL}/v0/works/${workId}/versions`;
  const params = {
    headers: {
      'Accept': 'application/json',
    },
    qs: {
      api_key: API_KEY,
    },
  };

  apiCalls.add(1);
  const response = http.get(url, params);
  
  const success = check(response, {
    'getVersions: status is 200': (r) => r.status === 200,
    'getVersions: has results': (r) => {
      const body = JSON.parse(r.body);
      return body.results && Array.isArray(body.results);
    },
  });

  if (success) {
    cacheHits.add(1); // Simulating cache hit for versions
  }
}

/**
 * Handle summary output
 */
export function summary(data: any) {
  console.log('\n' + '='.repeat(60));
  console.log('LOAD TEST SUMMARY');
  console.log('='.repeat(60));
  
  console.log(`\nTotal API Calls: ${apiCalls.sum}`);
  console.log(`Cache Hits: ${cacheHits.sum}`);
  
  console.log(`\nSearch Success Rate: ${(data.metrics.search_success_rate?.values?.rate || 0) * 100}%`);
  console.log(`Get Work Success Rate: ${(data.metrics.get_work_success_rate?.values?.rate || 0) * 100}%`);
  
  console.log(`\nSearch Response Time:`);
  console.log(`  Average: ${(data.metrics.search_response_time?.values?.avg || 0).toFixed(0)}ms`);
  console.log(`  P95: ${(data.metrics.search_response_time?.values?.['p(95)'] || 0).toFixed(0)}ms`);
  
  console.log(`\nGet Work Response Time:`);
  console.log(`  Average: ${(data.metrics.get_work_response_time?.values?.avg || 0).toFixed(0)}ms`);
  console.log(`  P95: ${(data.metrics.get_work_response_time?.values?.['p(95)'] || 0).toFixed(0)}ms`);
  
  console.log(`\nHTTP Request Duration:`);
  console.log(`  Average: ${(data.metrics.http_req_duration?.values?.avg || 0).toFixed(0)}ms`);
  console.log(`  P95: ${(data.metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(0)}ms`);
  console.log(`  P99: ${(data.metrics.http_req_duration?.values?.['p(99)'] || 0).toFixed(0)}ms`);
  
  console.log('\n' + '='.repeat(60));
}
