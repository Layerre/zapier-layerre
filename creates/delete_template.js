'use strict';

// Delete a template (soft delete)
const perform = async (z, bundle) => {
  await z.request({
    method: 'DELETE',
    url: `https://api.layerre.com/v1/template/${bundle.inputData.template_id}`
  });

  // Return the template ID to confirm deletion
  return {
    id: bundle.inputData.template_id,
    deleted: true
  };
};

module.exports = {
  key: 'delete_template',
  noun: 'Template',
  display: {
    label: 'Delete Template',
    description: 'Deletes a template by ID. This is a soft delete - the template will be marked as deleted but not permanently removed.'
  },

  operation: {
    inputFields: [
      {
        key: 'template_id',
        label: 'Template ID',
        type: 'string',
        required: true,
        dynamic: 'list_templates.id.name',
        helpText: 'The ID of the template to delete.'
      }
    ],

    perform: perform,

    sample: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      deleted: true
    },

    outputFields: [
      { key: 'id', label: 'Template ID', type: 'string' },
      { key: 'deleted', label: 'Deleted', type: 'boolean' }
    ]
  }
};

