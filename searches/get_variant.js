'use strict';

// Get a single variant by ID
const perform = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: `https://api.layerre.com/v1/template/${bundle.inputData.template_id}/variant/${bundle.inputData.variant_id}`
  });

  // Zapier expects searches to return an array
  return [response.data];
};

module.exports = {
  key: 'get_variant',
  noun: 'Variant',
  display: {
    label: 'Get Variant',
    description: 'Retrieves a single variant by its ID.'
  },

  operation: {
    inputFields: [
      {
        key: 'template_id',
        label: 'Template ID',
        type: 'string',
        required: true,
        dynamic: 'list_templates.id.name',
        helpText: 'The ID of the template that owns the variant.'
      },
      {
        key: 'variant_id',
        label: 'Variant ID',
        type: 'string',
        required: true,
        dynamic: 'list_variants.id.name',
        helpText: 'The ID of the variant to retrieve.'
      }
    ],

    perform: perform,

    sample: {
      id: '323e4567-e89b-12d3-a456-426614174002',
      template_id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://example.com/variant.png',
      width: 1080,
      height: 1080,
      overrides: [
        {
          layer_id: '223e4567-e89b-12d3-a456-426614174001',
          x: 100,
          y: 100,
          properties: {
            text: 'Custom Text'
          }
        }
      ],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },

    outputFields: [
      { key: 'id', label: 'Variant ID', type: 'string' },
      { key: 'template_id', label: 'Template ID', type: 'string' },
      { key: 'url', label: 'Variant URL', type: 'string' },
      { key: 'width', label: 'Width (px)', type: 'integer' },
      { key: 'height', label: 'Height (px)', type: 'integer' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' }
    ]
  }
};

