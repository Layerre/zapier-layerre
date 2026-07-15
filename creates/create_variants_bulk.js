'use strict';

const { VARIANT_OUTPUT_FIELDS } = require('../lib/variant_output_fields');

const perform = async (z, bundle) => {
  const exportType = bundle.inputData.export_type || 'pdf';
  const combinePdf = bundle.inputData.combine_pdf === true || bundle.inputData.combine_pdf === 'true';

  if (combinePdf && exportType !== 'pdf') {
    throw new z.errors.Error(
      'combine_pdf is only valid when export_type is pdf',
      'InvalidData',
      400
    );
  }

  let items;
  try {
    items = JSON.parse(bundle.inputData.items_json);
  } catch (e) {
    throw new z.errors.Error(
      'items_json must be valid JSON array of bulk variant items',
      'InvalidData',
      400
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new z.errors.Error(
      'items_json must be a non-empty JSON array',
      'InvalidData',
      400
    );
  }

  const body = {
    export_type: exportType,
    combine_pdf: combinePdf,
    items: items.map((item, index) => {
      if (!item || typeof item !== 'object') {
        throw new z.errors.Error(
          `Bulk item ${index + 1} must be an object`,
          'InvalidData',
          400
        );
      }

      const mapped = {};
      if (Array.isArray(item.overrides)) {
        mapped.overrides = item.overrides;
      } else {
        mapped.overrides = [];
      }
      if (item.width !== undefined && item.width !== null && item.width !== '') {
        mapped.width = Number(item.width);
      }
      if (item.height !== undefined && item.height !== null && item.height !== '') {
        mapped.height = Number(item.height);
      }
      if (item.page_number !== undefined && item.page_number !== null && item.page_number !== '') {
        mapped.page_number = parseInt(item.page_number, 10);
      }

      return mapped;
    })
  };

  const response = await z.request({
    method: 'POST',
    url: `https://api.layerre.com/v1/template/${bundle.inputData.template_id}/variant/bulk`,
    body
  });

  return response.data;
};

module.exports = {
  key: 'create_variants_bulk',
  noun: 'Variant Batch',
  display: {
    label: 'Create Variants (Bulk)',
    description:
      'Create multiple variants in one request. Set combine_pdf=true (Plus+ only) to merge PDF items into one multi-page file. Pass items as a JSON array.'
  },

  operation: {
    inputFields: [
      {
        key: 'template_id',
        label: 'Template ID',
        type: 'string',
        required: true,
        dynamic: 'list_templates.id.name',
        helpText: 'The ID of the template to create variants from.'
      },
      {
        key: 'export_type',
        label: 'Export Format',
        type: 'string',
        required: false,
        default: 'pdf',
        choices: ['png', 'jpeg', 'pdf', 'webp'],
        helpText: 'Export format applied to every item in the batch.'
      },
      {
        key: 'combine_pdf',
        label: 'Combine Into One PDF',
        type: 'boolean',
        required: false,
        default: 'false',
        helpText:
          'Plus+ only. When true and export_type is pdf, merges all items into one multi-page PDF. The response includes combined_pdf.variant.'
      },
      {
        key: 'items_json',
        label: 'Items (JSON Array)',
        type: 'text',
        required: true,
        helpText:
          'JSON array of bulk items. Each item may include page_number (0-based), overrides (array of {layer_id, properties, x?, y?}), and optional width/height. Example: [{"page_number":0,"overrides":[{"layer_id":"uuid","properties":{"text":"Hello"}}]},{"page_number":1,"overrides":[]}]'
      }
    ],

    perform,

    sample: {
      results: [
        {
          index: 0,
          success: true,
          variant: null,
          error: null
        }
      ],
      total_requested: 2,
      total_created: 2,
      total_failed: 0,
      combined_pdf: {
        url: 'https://example.com/combined.pdf',
        signed_url_expiry: '2024-01-01T12:00:00Z',
        variant: {
          id: '423e4567-e89b-12d3-a456-426614174003',
          template_id: '123e4567-e89b-12d3-a456-426614174000',
          url: 'https://example.com/combined.pdf',
          is_combined_pdf: true,
          combined_section_count: 2,
          page_number: 0,
          width: 1080,
          height: 1080,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      }
    },

    outputFields: [
      { key: 'total_requested', label: 'Total Requested', type: 'integer' },
      { key: 'total_created', label: 'Total Created', type: 'integer' },
      { key: 'total_failed', label: 'Total Failed', type: 'integer' },
      { key: 'combined_pdf__url', label: 'Combined PDF URL', type: 'string' },
      { key: 'combined_pdf__signed_url_expiry', label: 'Combined PDF Signed URL Expiry', type: 'datetime' },
      { key: 'combined_pdf__variant__id', label: 'Combined PDF Variant ID', type: 'string' },
      { key: 'combined_pdf__variant__is_combined_pdf', label: 'Combined PDF Is Combined', type: 'boolean' },
      { key: 'combined_pdf__variant__combined_section_count', label: 'Combined PDF Section Count', type: 'integer' },
      ...VARIANT_OUTPUT_FIELDS.map((field) => ({
        ...field,
        key: `combined_pdf__variant__${field.key}`
      }))
    ]
  }
};
