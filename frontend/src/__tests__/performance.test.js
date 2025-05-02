import { describe, it, expect, beforeAll, afterAll } from 'jest';

const BASE_URL = 'https://restcountries.com/v3.1';

// Performance thresholds
const RESPONSE_TIME_THRESHOLD = 2000; // 2 seconds
const CONCURRENT_REQUESTS = 5;

describe('REST Countries API Performance Tests', () => {
  // Test response time for single request
  it('should respond within acceptable time for single request', async () => {
    const startTime = performance.now();
    const response = await fetch(`${BASE_URL}/all`);
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD);
  });

  // Test concurrent requests
  it('should handle concurrent requests efficiently', async () => {
    const requests = Array(CONCURRENT_REQUESTS).fill().map(() => 
      fetch(`${BASE_URL}/all`)
    );

    const startTime = performance.now();
    const responses = await Promise.all(requests);
    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Check all responses are successful
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    // Average time per request should be less than threshold
    const averageTime = totalTime / CONCURRENT_REQUESTS;
    expect(averageTime).toBeLessThan(RESPONSE_TIME_THRESHOLD);
  });

  // Test response time for different endpoints
  it('should maintain consistent response times across different endpoints', async () => {
    const endpoints = [
      '/all',
      '/name/sri lanka',
      '/region/asia',
      '/alpha/lka'
    ];

    const responseTimes = await Promise.all(
      endpoints.map(async (endpoint) => {
        const startTime = performance.now();
        const response = await fetch(`${BASE_URL}${endpoint}`);
        const endTime = performance.now();
        
        expect(response.status).toBe(200);
        return endTime - startTime;
      })
    );

    // Check if all response times are within threshold
    responseTimes.forEach(time => {
      expect(time).toBeLessThan(RESPONSE_TIME_THRESHOLD);
    });

    // Check if response times are relatively consistent
    const maxTime = Math.max(...responseTimes);
    const minTime = Math.min(...responseTimes);
    const timeDifference = maxTime - minTime;
    
    // Time difference between fastest and slowest request should be reasonable
    expect(timeDifference).toBeLessThan(RESPONSE_TIME_THRESHOLD / 2);
  });

  // Test payload size
  it('should return reasonable payload sizes', async () => {
    const response = await fetch(`${BASE_URL}/all`);
    const data = await response.json();
    
    // Convert to string to measure size
    const payloadSize = JSON.stringify(data).length;
    
    // Payload should be less than 1MB
    expect(payloadSize).toBeLessThan(1024 * 1024);
  });

  // Test caching behavior
  it('should demonstrate caching behavior on repeated requests', async () => {
    // First request
    const startTime1 = performance.now();
    await fetch(`${BASE_URL}/all`);
    const endTime1 = performance.now();
    const firstRequestTime = endTime1 - startTime1;

    // Second request (should be faster due to caching)
    const startTime2 = performance.now();
    await fetch(`${BASE_URL}/all`);
    const endTime2 = performance.now();
    const secondRequestTime = endTime2 - startTime2;

    // Second request should be faster than first
    expect(secondRequestTime).toBeLessThan(firstRequestTime);
  });
}); 