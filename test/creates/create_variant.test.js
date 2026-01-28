'use strict';

const zapier = require('zapier-platform-core');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('Create Variant', () => {
  zapier.tools.env.inject();

  let createdTemplateId = null;
  let createdVariantId = null;

  afterAll(async () => {
    if (!process.env.API_KEY) return;

    // Cleanup variant first, then template
    if (createdTemplateId && createdVariantId) {
      try {
        await appTester(App.creates.delete_variant.operation.perform, {
          authData: { api_key: process.env.API_KEY },
          inputData: { template_id: createdTemplateId, variant_id: createdVariantId }
        });
      } catch (e) {
        // ignore cleanup failures
      }
    }

    if (createdTemplateId) {
      try {
        await appTester(App.creates.delete_template.operation.perform, {
          authData: { api_key: process.env.API_KEY },
          inputData: { template_id: createdTemplateId }
        });
      } catch (e) {
        // ignore cleanup failures
      }
    }
  });

  it('should create a variant from a template (creates template automatically)', async () => {
    if (!process.env.API_KEY) {
      console.log('Skipping: API_KEY not set in environment');
      return;
    }
    if (!process.env.DESIGN_URL) {
      console.log('Skipping: DESIGN_URL not set in environment');
      return;
    }

    // 1) Create a template to use for the variant
    const createdTemplate = await appTester(App.creates.create_template.operation.perform, {
      authData: { api_key: process.env.API_KEY },
      inputData: { design_url: process.env.DESIGN_URL }
    });

    expect(createdTemplate).toBeDefined();
    expect(createdTemplate.id).toBeDefined();
    createdTemplateId = createdTemplate.id;

    // 2) Create a variant from that template
    const createdVariant = await appTester(App.creates.create_variant.operation.perform, {
      authData: { api_key: process.env.API_KEY },
      inputData: { template_id: createdTemplateId, export_type: 'png' }
    });

    expect(createdVariant).toBeDefined();
    expect(createdVariant.id).toBeDefined();
    expect(createdVariant.url).toBeDefined();
    expect(createdVariant.template_id).toBe(createdTemplateId);
    createdVariantId = createdVariant.id;
  });
});

