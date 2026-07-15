'use strict';

const { VARIANT_OUTPUT_FIELDS, VARIANT_SAMPLE } = require('../lib/variant_output_fields');

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

    sample: VARIANT_SAMPLE,

    outputFields: VARIANT_OUTPUT_FIELDS
  }
};

