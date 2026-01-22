'use strict';

const App = require('../../index');

describe('Trigger: List Variants', () => {
  it('should return array of variants (unit)', async () => {
    const bundle = {
      authData: {
        api_key: 'test_api_key'
      },
      inputData: {
        template_id: 'template_123',
        limit: 100
      }
    };

    const z = {
      request: jest.fn().mockResolvedValue({
        data: [
          { id: 'v_1', template_id: 'template_123', url: 'https://example.com/v1.png', width: 1080, height: 1080 },
          { id: 'v_2', template_id: 'template_123', url: 'https://example.com/v2.png', width: 1080, height: 1080 },
          { id: 'v_3', template_id: 'template_123', url: 'https://example.com/v3.png', width: 1080, height: 1080 },
          { id: 'v_4', template_id: 'template_123', url: 'https://example.com/v4.png', width: 1080, height: 1080 }
        ]
      })
    };

    const results = await App.triggers.list_variants.operation.perform(z, bundle);

    expect(z.request).toHaveBeenCalledTimes(1);
    expect(z.request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.layerre.com/v1/template/template_123/variants',
      params: { skip: 0, limit: 100 }
    });

    // Verify it returns an array
    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(4);
    
    // Verify each variant has required fields
    results.forEach(variant => {
      expect(variant.id).toBeDefined();
      expect(variant.template_id).toBe('template_123');
      expect(variant.url).toBeDefined();
      expect(variant.width).toBeDefined();
      expect(variant.height).toBeDefined();
    });
  });

  it('should handle empty results', async () => {
    const bundle = {
      authData: {
        api_key: 'test_api_key'
      },
      inputData: {
        template_id: 'template_with_no_variants'
      }
    };

    const z = {
      request: jest.fn().mockResolvedValue({
        data: []
      })
    };

    const results = await App.triggers.list_variants.operation.perform(z, bundle);

    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });

  it('should handle pagination parameters', async () => {
    const bundle = {
      authData: {
        api_key: 'test_api_key'
      },
      inputData: {
        template_id: 'template_123',
        skip: 10,
        limit: 50
      }
    };

    const z = {
      request: jest.fn().mockResolvedValue({
        data: [{ id: 'v_11', template_id: 'template_123' }]
      })
    };

    await App.triggers.list_variants.operation.perform(z, bundle);

    expect(z.request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.layerre.com/v1/template/template_123/variants',
      params: { skip: 10, limit: 50 }
    });
  });
});

