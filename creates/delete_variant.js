'use strict';

// Delete a variant (soft delete)
const perform = async (z, bundle) => {
  await z.request({
    method: 'DELETE',
    url: `https://api.layerre.com/v1/template/${bundle.inputData.template_id}/variant/${bundle.inputData.variant_id}`
  });

  // Return the IDs to confirm deletion
  return {
    id: bundle.inputData.variant_id,
    template_id: bundle.inputData.template_id,
    deleted: true
  };
};

module.exports = {
  key: 'delete_variant',
  noun: 'Variant',
  display: {
    label: 'Delete Variant',
    description: 'Deletes a variant by ID. This is a soft delete - the variant will be marked as deleted but not permanently removed.'
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
        helpText: 'The ID of the variant to delete.'
      }
    ],

    perform: perform,

    sample: {
      id: '323e4567-e89b-12d3-a456-426614174002',
      template_id: '123e4567-e89b-12d3-a456-426614174000',
      deleted: true
    },

    outputFields: [
      { key: 'id', label: 'Variant ID', type: 'string' },
      { key: 'template_id', label: 'Template ID', type: 'string' },
      { key: 'deleted', label: 'Deleted', type: 'boolean' }
    ]
  }
};

