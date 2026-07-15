'use strict';

const VARIANT_OUTPUT_FIELDS = [
  { key: 'id', label: 'Variant ID', type: 'string' },
  { key: 'template_id', label: 'Template ID', type: 'string' },
  { key: 'url', label: 'Variant URL', type: 'string' },
  { key: 'signed_url_expiry', label: 'Signed URL Expiry', type: 'datetime' },
  { key: 'width', label: 'Width (px)', type: 'integer' },
  { key: 'height', label: 'Height (px)', type: 'integer' },
  { key: 'page_number', label: 'Page Number', type: 'integer' },
  { key: 'is_combined_pdf', label: 'Is Combined PDF', type: 'boolean' },
  { key: 'combined_section_count', label: 'Combined Section Count', type: 'integer' },
  { key: 'created_at', label: 'Created At', type: 'datetime' },
  { key: 'updated_at', label: 'Updated At', type: 'datetime' }
];

const VARIANT_SAMPLE = {
  id: '323e4567-e89b-12d3-a456-426614174002',
  template_id: '123e4567-e89b-12d3-a456-426614174000',
  url: 'https://example.com/variant.png',
  signed_url_expiry: '2024-01-01T12:00:00Z',
  width: 1080,
  height: 1080,
  page_number: 0,
  is_combined_pdf: false,
  combined_section_count: null,
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
};

function formatVariantName(v) {
  const id = v && v.id ? String(v.id) : '';
  const shortId = id ? id.slice(0, 8) : 'unknown';
  const dims = v && v.width && v.height ? ` (${v.width}×${v.height})` : '';
  if (v && v.is_combined_pdf) {
    const sections = v.combined_section_count ? ` · ${v.combined_section_count} pages` : '';
    return `Combined PDF ${shortId}${sections}`;
  }
  const pageSuffix =
    v && typeof v.page_number === 'number' ? ` · page ${v.page_number + 1}` : '';
  return `Variant ${shortId}${dims}${pageSuffix}`;
}

module.exports = {
  VARIANT_OUTPUT_FIELDS,
  VARIANT_SAMPLE,
  formatVariantName
};
