'use strict';

// Trigger: list templates for the authenticated user (used for dynamic dropdowns)
const perform = async (z, bundle) => {
  const params = {
    skip: bundle.inputData && bundle.inputData.skip ? bundle.inputData.skip : 0,
    limit: bundle.inputData && bundle.inputData.limit ? bundle.inputData.limit : 100,
    include_layers: bundle.inputData && bundle.inputData.include_layers ? bundle.inputData.include_layers : false
  };

  const response = await z.request({
    method: 'GET',
    url: 'https://api.layerre.com/v1/templates',
    params
  });

  return response.data;
};

module.exports = {
  key: 'list_templates',
  noun: 'Template',
  display: {
    label: 'List Templates',
    description: 'Triggers when you have templates (useful for iterating over all your templates).',
    hidden: false
  },

  operation: {
    cleanInputData: false,
    inputFields: [
      {
        key: 'skip',
        label: 'Skip',
        type: 'integer',
        required: false,
        default: '0',
        helpText: 'Number of templates to skip (for pagination).'
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'integer',
        required: false,
        default: '100',
        helpText: 'Maximum number of templates to return (1-1000).'
      },
      {
        key: 'include_layers',
        label: 'Include Layers',
        type: 'boolean',
        required: false,
        default: 'false',
        helpText: 'Whether to include layer data in the response (slower for large templates).'
      }
    ],

    perform,

    sample: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Sample Instagram Post',
      width: 1080,
      height: 1080,
      source_url: 'https://www.canva.com/design/DABCdef123/view',
      background_color: '#FFFFFF',
      preview_url: 'https://example.com/preview.png',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      variant_count: 5
    },

    outputFields: [
      { key: 'id', label: 'Template ID', type: 'string' },
      { key: 'name', label: 'Template Name', type: 'string' },
      { key: 'width', label: 'Width (px)', type: 'integer' },
      { key: 'height', label: 'Height (px)', type: 'integer' },
      { key: 'source_url', label: 'Source URL', type: 'string' },
      { key: 'background_color', label: 'Background Color', type: 'string' },
      { key: 'preview_url', label: 'Preview URL', type: 'string' },
      { key: 'variant_count', label: 'Variant Count', type: 'integer' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' }
    ]
  }
};


