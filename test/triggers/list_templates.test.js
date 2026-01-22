'use strict';

const App = require('../../index');

describe('Trigger: List Templates', () => {
  it('should return array of templates (unit)', async () => {
    const bundle = {
      authData: {
        api_key: 'test_api_key'
      },
      inputData: {
        limit: 10
      }
    };

    const z = {
      request: jest.fn().mockResolvedValue({
        data: [
          { id: 't_1', name: 'Template 1', width: 1080, height: 1080 },
          { id: 't_2', name: 'Template 2', width: 800, height: 600 },
          { id: 't_3', name: 'Template 3', width: 1200, height: 628 }
        ]
      })
    };

    const results = await App.triggers.list_templates.operation.perform(z, bundle);

    expect(z.request).toHaveBeenCalledTimes(1);
    expect(z.request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.layerre.com/v1/templates',
      params: { skip: 0, limit: 10, include_layers: false }
    });

    // Verify it returns an array
    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(3);
    
    // Verify each template has required fields
    results.forEach(template => {
      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.width).toBeDefined();
      expect(template.height).toBeDefined();
    });
  });

  it('should handle empty results', async () => {
    const bundle = {
      authData: {
        api_key: 'test_api_key'
      },
      inputData: {}
    };

    const z = {
      request: jest.fn().mockResolvedValue({
        data: []
      })
    };

    const results = await App.triggers.list_templates.operation.perform(z, bundle);

    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });
});

