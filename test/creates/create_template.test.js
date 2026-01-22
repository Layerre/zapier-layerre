'use strict';

const zapier = require('zapier-platform-core');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('Create Template', () => {
  zapier.tools.env.inject();

  it('should create a template from a Canva URL', async () => {
    if (!process.env.API_KEY) {
      console.log('Skipping: API_KEY not set in environment');
      return;
    }
    if (!process.env.CANVA_URL) {
      console.log('Skipping: CANVA_URL not set in environment');
      return;
    }

    const bundle = {
      authData: {
        api_key: process.env.API_KEY
      },
      inputData: {
        canva_url: process.env.CANVA_URL
      }
    };

    const result = await appTester(
      App.creates.create_template.operation.perform,
      bundle
    );

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
  });

  it('should fail with invalid Canva URL', async () => {
    if (!process.env.API_KEY) {
      console.log('Skipping: API_KEY not set in environment');
      return;
    }

    const bundle = {
      authData: {
        api_key: process.env.API_KEY
      },
      inputData: {
        canva_url: 'not-a-valid-url'
      }
    };

    await expect(
      appTester(App.creates.create_template.operation.perform, bundle)
    ).rejects.toThrow();
  });
});

