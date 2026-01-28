'use strict';

// Trigger: list variants for a template (used for dynamic dropdowns)
const perform = async (z, bundle) => {
  const params = {
    skip: bundle.inputData && bundle.inputData.skip ? bundle.inputData.skip : 0,
    limit: bundle.inputData && bundle.inputData.limit ? bundle.inputData.limit : 100
  };

  const response = await z.request({
    method: 'GET',
    url: `https://api.layerre.com/v1/template/${bundle.inputData.template_id}/variants`,
    params
  });

  // Provide a friendly `name` for selection UIs
  const variants = Array.isArray(response.data) ? response.data : [];
  return variants.map((v) => {
    const id = v && v.id ? String(v.id) : '';
    const shortId = id ? id.slice(0, 8) : 'unknown';
    const dims =
      v && v.width && v.height ? ` (${v.width}×${v.height})` : '';
    return {
      ...v,
      name: v && v.name ? v.name : `Variant ${shortId}${dims}`
    };
  });
};

module.exports = {
  key: 'list_variants',
  noun: 'Variant',
  display: {
    label: 'List Variants',
    description: 'Used for dropdowns to select a variant.',
    hidden: true
  },

  operation: {
    cleanInputData: false,
    inputFields: [
      {
        key: 'template_id',
        label: 'Template ID',
        type: 'string',
        required: true,
        dynamic: 'list_templates.id.name',
        helpText: 'The ID of the template to list variants for.'
      },
      {
        key: 'skip',
        label: 'Skip',
        type: 'integer',
        required: false,
        default: '0',
        helpText: 'Number of variants to skip (for pagination).'
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'integer',
        required: false,
        default: '100',
        helpText: 'Maximum number of variants to return (1-1000).'
      }
    ],

    perform,

    sample: {
      id: '323e4567-e89b-12d3-a456-426614174002',
      name: 'Variant 323e4567 (1080×1080)',
      template_id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://example.com/variant.png',
      width: 1080,
      height: 1080,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },

    outputFields: [
      { key: 'id', label: 'Variant ID', type: 'string' },
      { key: 'name', label: 'Variant Name', type: 'string' },
      { key: 'template_id', label: 'Template ID', type: 'string' },
      { key: 'url', label: 'Variant URL', type: 'string' },
      { key: 'width', label: 'Width (px)', type: 'integer' },
      { key: 'height', label: 'Height (px)', type: 'integer' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' }
    ]
  }
};


