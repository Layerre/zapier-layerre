# Changelog

## 1.1.0

Bulk variant creation, combined PDF exports, and multi-page template support.

1. New action! create/create_variants_bulk — create many variants in one request, with optional combined PDF output
2. Update create/create_variant — add page_number input for multi-page templates
3. Update create/create_variant — add page_number, is_combined_pdf, and combined_section_count to output fields
4. Update search/get_variant — add page_number, is_combined_pdf, and combined_section_count to output fields
5. Update trigger/list_variants — add page_number, is_combined_pdf, and combined_section_count to output fields

## 1.0.0

Initial release to public.

* Create, delete, and list templates
* Create and delete variants with layer overrides
* List layers, get template, and get variant
