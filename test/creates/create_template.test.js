'use strict';

const zapier = require('zapier-platform-core');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('Create Template', () => {
  zapier.tools.env.inject();

  it('should create a template from a design URL', async () => {
    if (!process.env.API_KEY) {
      console.log('Skipping: API_KEY not set in environment');
      return;
    }
    if (!process.env.DESIGN_URL) {
      console.log('Skipping: DESIGN_URL not set in environment');
      return;
    }

    const bundle = {
      authData: {
        api_key: process.env.API_KEY
      },
      inputData: {
        design_url: process.env.DESIGN_URL
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

  it('should fail with invalid design URL', async () => {
    if (!process.env.API_KEY) {
      console.log('Skipping: API_KEY not set in environment');
      return;
    }

    const bundle = {
      authData: {
        api_key: process.env.API_KEY
      },
      inputData: {
        design_url: 'not-a-valid-url'
      }
    };

    await expect(
      appTester(App.creates.create_template.operation.perform, bundle)
    ).rejects.toThrow();
  });
});

