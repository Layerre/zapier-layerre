'use strict';

const { VARIANT_OUTPUT_FIELDS, VARIANT_SAMPLE, formatVariantName } = require('../lib/variant_output_fields');

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
  return variants.map((v) => ({
    ...v,
    name: formatVariantName(v)
  }));
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
      ...VARIANT_SAMPLE,
      name: 'Variant 323e4567 (1080×1080)'
    },

    outputFields: [
      { key: 'id', label: 'Variant ID', type: 'string' },
      { key: 'name', label: 'Variant Name', type: 'string' },
      ...VARIANT_OUTPUT_FIELDS.filter((field) => field.key !== 'id')
    ]
  }
};


