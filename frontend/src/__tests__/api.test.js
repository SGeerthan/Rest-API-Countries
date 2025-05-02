import { describe, it, expect, beforeAll, afterAll } from 'jest';

const BASE_URL = 'https://restcountries.com/v3.1';

describe('REST Countries API Tests', () => {
  let response;

  // Test GET all countries
  it('should fetch all countries successfully', async () => {
    response = await fetch(`${BASE_URL}/all`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  // Test GET country by name
  it('should fetch country by name successfully', async () => {
    const countryName = 'sri lanka';
    response = await fetch(`${BASE_URL}/name/${countryName}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name.common.toLowerCase()).toContain(countryName);
  });

  // Test GET country by region
  it('should fetch countries by region successfully', async () => {
    const region = 'asia';
    response = await fetch(`${BASE_URL}/region/${region}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.every(country => country.region.toLowerCase() === region)).toBe(true);
  });

  // Test GET country by code
  it('should fetch country by code successfully', async () => {
    const code = 'lka';
    response = await fetch(`${BASE_URL}/alpha/${code}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].cca3.toLowerCase()).toBe(code);
  });

  // Test error handling for invalid country name
  it('should handle invalid country name gracefully', async () => {
    const invalidName = 'nonexistentcountry123';
    response = await fetch(`${BASE_URL}/name/${invalidName}`);
    expect(response.status).toBe(404);
  });

  // Test response structure
  it('should return correct data structure for a country', async () => {
    response = await fetch(`${BASE_URL}/name/sri lanka`);
    const data = await response.json();
    const country = data[0];

    expect(country).toHaveProperty('name');
    expect(country).toHaveProperty('capital');
    expect(country).toHaveProperty('population');
    expect(country).toHaveProperty('region');
    expect(country).toHaveProperty('flags');
    expect(country).toHaveProperty('languages');
    expect(country).toHaveProperty('currencies');
  });

  // Test search functionality
  it('should handle partial country name search', async () => {
    const partialName = 'sri';
    response = await fetch(`${BASE_URL}/name/${partialName}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.some(country => 
      country.name.common.toLowerCase().includes(partialName)
    )).toBe(true);
  });
}); 