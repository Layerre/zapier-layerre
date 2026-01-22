/* globals describe, it, expect */

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('API Key Authentication', () => {
  // Load environment variables for testing
  zapier.tools.env.inject();

  it('should authenticate with valid API key', async () => {
    const bundle = {
      authData: {
        api_key: process.env.API_KEY || 'test_api_key',
      }
    };

    // Skip test if no API key is provided
    if (!process.env.API_KEY) {
      console.log('Skipping: API_KEY not set in environment');
      return;
    }

    const response = await appTester(App.authentication.test, bundle);

    expect(response.status).toBe(200);
    expect(response.request.headers.Authorization).toContain('Bearer');
    expect(response.request.headers.Authorization).toContain(bundle.authData.api_key);
  });

  it('should fail with invalid API key', async () => {
    const bundle = {
      authData: {
        api_key: 'invalid_api_key_12345',
      }
    };

    try {
      await appTester(App.authentication.test, bundle);
      throw new Error('appTester should have thrown an authentication error');
    } catch (err) {
      expect(err.message).toContain('API key');
    }
  });

  it('should add Bearer token to requests', async () => {
    const bundle = {
      authData: {
        api_key: 'test_key_123'
      }
    };

    // Test that the beforeRequest middleware adds the header correctly
    const request = {
      url: 'https://api.layerre.com/v1/templates',
      headers: {}
    };

    const modifiedRequest = App.beforeRequest[0](request, null, bundle);
    
    expect(modifiedRequest.headers.Authorization).toBe('Bearer test_key_123');
  });
});
