'use strict';

// Get a single template by ID
const perform = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: `https://api.layerre.com/v1/template/${bundle.inputData.template_id}`
  });

  // Zapier expects searches to return an array
  return [response.data];
};

module.exports = {
  key: 'get_template',
  noun: 'Template',
  display: {
    label: 'Get Template',
    description: 'Retrieves a single template by its ID with all layers and metadata.'
  },

  operation: {
    inputFields: [
      {
        key: 'template_id',
        label: 'Template ID',
        type: 'string',
        required: true,
        dynamic: 'list_templates.id.name',
        helpText: 'The ID of the template to retrieve.'
      }
    ],

    perform: perform,

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
      layers: [
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          template_id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Title',
          layer_type: 'text',
          x: 100,
          y: 100,
          position: 1,
          properties: {
            text: 'Sample Title',
            font_size: 48,
            color: '#000000'
          }
        }
      ]
    },

    outputFields: [
      { key: 'id', label: 'Template ID', type: 'string' },
      { key: 'name', label: 'Template Name', type: 'string' },
      { key: 'width', label: 'Width (px)', type: 'integer' },
      { key: 'height', label: 'Height (px)', type: 'integer' },
      { key: 'source_url', label: 'Source URL', type: 'string' },
      { key: 'background_color', label: 'Background Color', type: 'string' },
      { key: 'preview_url', label: 'Preview URL', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' },
      { key: 'layers[]id', label: 'Layer ID' },
      { key: 'layers[]name', label: 'Layer Name' },
      { key: 'layers[]layer_type', label: 'Layer Type' }
    ]
  }
};

