'use strict';

// Trigger: list layers for a template (used for dynamic dropdowns)
const perform = async (z, bundle) => {
  // If template_id is not provided, return empty array
  // This can happen when Zapier is populating the dropdown before template_id is selected
  if (!bundle.inputData || !bundle.inputData.template_id) {
    return [];
  }

  const response = await z.request({
    method: 'GET',
    url: `https://api.layerre.com/v1/template/${bundle.inputData.template_id}`
  });

  // Extract layers from the template response
  const template = response.data;
  const layers = Array.isArray(template.layers) ? template.layers : [];

  // Zapier dynamic dropdowns display the "labelField" configured in `dynamic`.
  // Provide a friendly `name` for selection UIs if not already present
  return layers.map((layer) => {
    const id = layer && layer.id ? String(layer.id) : '';
    const layerName = layer && layer.name ? layer.name : '';
    const layerType = layer && layer.layer_type ? layer.layer_type : '';
    
    // Create a display name: "Layer Name (type)" or "Layer ID (type)" if no name
    const displayName = layerName 
      ? `${layerName} (${layerType})`
      : layerType 
        ? `Layer ${id.slice(0, 8)} (${layerType})`
        : `Layer ${id.slice(0, 8)}`;
    
    return {
      ...layer,
      id: id,
      name: displayName
    };
  });
};

module.exports = {
  key: 'list_layers',
  noun: 'Layer',
  display: {
    label: 'List Layers',
    description: 'Used for dropdowns to select a layer.',
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
        helpText: 'The ID of the template to list layers for.'
      }
    ],

    perform: perform,

    sample: {
      id: '223e4567-e89b-12d3-a456-426614174001',
      name: 'Title (text)',
      template_id: '123e4567-e89b-12d3-a456-426614174000',
      layer_type: 'text',
      x: 100,
      y: 100,
      position: 1,
      properties: {
        text: 'Sample Title',
        font_size: 48,
        color: '#000000'
      }
    },

    outputFields: [
      { key: 'id', label: 'Layer ID', type: 'string' },
      { key: 'name', label: 'Layer Name', type: 'string' },
      { key: 'layer_type', label: 'Layer Type', type: 'string' },
      { key: 'template_id', label: 'Template ID', type: 'string' }
    ]
  }
};

