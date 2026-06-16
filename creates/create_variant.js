'use strict';

// Create a variant from a template with layer overrides
const perform = async (z, bundle) => {

  const ensureArray = (v) => {
    if (v === undefined || v === null || v === '') return [];
    if (Array.isArray(v)) return v;

    // Zapier sometimes stringifies "line items" into a single comma/newline-separated string
    // when you insert a list token into an input field. Recover the list here.
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (!trimmed) return [];
      if (trimmed.includes(',') || trimmed.includes('\n')) {
        return trimmed
          .split(/[\n,]+/g)
          .map((s) => s.trim())
          .filter((s) => s);
      }
      return [trimmed];
    }

    return [v];
  };

  const parseOptionalNumber = (v) => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    // eslint-disable-next-line no-restricted-globals
    return isNaN(n) ? undefined : n;
  };

  const parseOptionalInteger = (v) => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = parseInt(v, 10);
    // eslint-disable-next-line no-restricted-globals
    return isNaN(n) ? undefined : n;
  };

  const body = {
    export_type: bundle.inputData.export_type || 'png'
  };

  // Add optional dimensions
  if (bundle.inputData.width) {
    body.width = parseOptionalInteger(bundle.inputData.width);
  }
  if (bundle.inputData.height) {
    body.height = parseOptionalInteger(bundle.inputData.height);
  }

  // Build overrides from Line Items
  const overridesLayerIds = ensureArray(bundle.inputData.override_layer_id);
  const overridesX = ensureArray(bundle.inputData.override_x);
  const overridesY = ensureArray(bundle.inputData.override_y);

  const propText = ensureArray(bundle.inputData.prop_text);
  const propFontSize = ensureArray(bundle.inputData.prop_font_size);
  const propFontName = ensureArray(bundle.inputData.prop_font_name);
  const propTextAlign = ensureArray(bundle.inputData.prop_text_align);
  const propRtlEnabled = ensureArray(bundle.inputData.prop_rtl_enabled);
  const propLetterSpacing = ensureArray(bundle.inputData.prop_letter_spacing);
  const propLineSpacing = ensureArray(bundle.inputData.prop_line_spacing);

  const propImgUrl = ensureArray(bundle.inputData.prop_img_url);
  const propOpacity = ensureArray(bundle.inputData.prop_opacity);
  const propFlipHorizontal = ensureArray(bundle.inputData.prop_flip_horizontal);
  const propFlipVertical = ensureArray(bundle.inputData.prop_flip_vertical);

  const propWidth = ensureArray(bundle.inputData.prop_width);
  const propHeight = ensureArray(bundle.inputData.prop_height);
  const propColor = ensureArray(bundle.inputData.prop_color);
  const propRotation = ensureArray(bundle.inputData.prop_rotation);

  const anyLineItemsProvided =
    overridesLayerIds.length ||
    overridesX.length ||
    overridesY.length ||
    propText.length ||
    propFontSize.length ||
    propFontName.length ||
    propTextAlign.length ||
    propLetterSpacing.length ||
    propLineSpacing.length ||
    propImgUrl.length ||
    propOpacity.length ||
    propFlipHorizontal.length ||
    propFlipVertical.length ||
    propWidth.length ||
    propHeight.length ||
    propColor.length ||
    propRotation.length;

  if (anyLineItemsProvided) {
    const lengths = [
      overridesLayerIds.length,
      overridesX.length,
      overridesY.length,
      propText.length,
      propFontSize.length,
      propFontName.length,
      propTextAlign.length,
      propLetterSpacing.length,
      propLineSpacing.length,
      propImgUrl.length,
      propOpacity.length,
      propFlipHorizontal.length,
      propFlipVertical.length,
      propWidth.length,
      propHeight.length,
      propColor.length,
      propRotation.length
    ].filter((n) => n > 0);

    const count = lengths.length ? Math.max(...lengths) : 0;
    const overrides = [];

    for (let i = 0; i < count; i++) {
      const layerId = overridesLayerIds[i];
      if (!layerId) {
        throw new z.errors.Error(
          `Missing override layer_id for row ${i + 1}. Each override row must include a layer_id.`,
          'InvalidData',
          400
        );
      }

      const override = { layer_id: layerId };
      const x = parseOptionalNumber(overridesX[i]);
      const y = parseOptionalNumber(overridesY[i]);
      if (x !== undefined) override.x = x;
      if (y !== undefined) override.y = y;

      const properties = {};
      const text = propText[i];
      if (text !== undefined && text !== null && text !== '') properties.text = text;

      const fontSize = parseOptionalNumber(propFontSize[i]);
      if (fontSize !== undefined) properties.font_size = fontSize;

      const fontName = propFontName[i];
      if (fontName !== undefined && fontName !== null && fontName !== '') properties.font_name = fontName;

      const textAlign = propTextAlign[i];
      if (textAlign !== undefined && textAlign !== null && textAlign !== '') properties.text_align = textAlign;

      const rtlEnabled = propRtlEnabled[i];
      if (rtlEnabled === true || rtlEnabled === 'true') properties.text_direction = 'rtl';

      const letterSpacing = parseOptionalNumber(propLetterSpacing[i]);
      if (letterSpacing !== undefined) properties.letter_spacing = letterSpacing;

      const lineSpacing = parseOptionalNumber(propLineSpacing[i]);
      if (lineSpacing !== undefined) properties.line_spacing = lineSpacing;

      const imgUrl = propImgUrl[i];
      if (imgUrl !== undefined && imgUrl !== null && imgUrl !== '') properties.img_url = imgUrl;

      const opacity = parseOptionalNumber(propOpacity[i]);
      if (opacity !== undefined) properties.opacity = opacity;

      const flipH = propFlipHorizontal[i];
      if (flipH !== undefined && flipH !== null && flipH !== '') properties.flip_horizontal = flipH === true || flipH === 'true';

      const flipV = propFlipVertical[i];
      if (flipV !== undefined && flipV !== null && flipV !== '') properties.flip_vertical = flipV === true || flipV === 'true';

      const w = parseOptionalNumber(propWidth[i]);
      if (w !== undefined) properties.width = w;

      const h = parseOptionalNumber(propHeight[i]);
      if (h !== undefined) properties.height = h;

      const color = propColor[i];
      if (color !== undefined && color !== null && color !== '') properties.color = color;

      const rotation = parseOptionalNumber(propRotation[i]);
      if (rotation !== undefined) properties.rotation = rotation;

      if (Object.keys(properties).length) {
        override.properties = properties;
      }

      overrides.push(override);
    }

    body.overrides = overrides;
  }

  const response = await z.request({
    method: 'POST',
    url: `https://api.layerre.com/v1/template/${bundle.inputData.template_id}/variant`,
    body: body
  });

  return response.data;
};

module.exports = {
  key: 'create_variant',
  noun: 'Variant',
  display: {
    label: 'Create Variant',
    description: 'Creates a variant of a template with custom layer overrides. Use this to generate personalized versions of your template.'
  },

  operation: {
    inputFields: [
      {
        key: 'template_id',
        label: 'Template ID',
        type: 'string',
        required: true,
        dynamic: 'list_templates.id.name',
        helpText: 'The ID of the template to create a variant from.'
      },
      {
        key: 'override_layer_id',
        label: 'Overrides: Layer ID',
        type: 'string',
        required: false,
        list: true,
        dynamic: 'list_layers.id.name',
        helpText: 'Line items. One layer_id per override row. Select a layer from the template.'
      },
      {
        key: 'override_x',
        label: 'Overrides: X',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional X override per row.'
      },
      {
        key: 'override_y',
        label: 'Overrides: Y',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional Y override per row.'
      },
      {
        key: 'prop_text',
        label: 'Overrides: Properties → Text',
        type: 'string',
        required: false,
        list: true,
        helpText: 'Line items. Optional text override per row.'
      },
      {
        key: 'prop_font_size',
        label: 'Overrides: Properties → Font Size',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional font_size override per row.'
      },
      {
        key: 'prop_font_name',
        label: 'Overrides: Properties → Font Name',
        type: 'string',
        required: false,
        list: true,
        helpText: 'Line items. Optional font_name override per row.'
      },
      {
        key: 'prop_text_align',
        label: 'Overrides: Properties → Text Align',
        type: 'string',
        required: false,
        list: true,
        choices: ['left', 'center', 'right', 'justify'],
        helpText: 'Line items. Optional text_align override per row.'
      },
      {
        key: 'prop_rtl_enabled',
        label: 'Overrides: Properties → RTL Enabled',
        type: 'boolean',
        required: false,
        list: true,
        helpText: 'Line items. Set to true to enable right-to-left text direction (Arabic, Hebrew, etc.) per row.'
      },
      {
        key: 'prop_letter_spacing',
        label: 'Overrides: Properties → Letter Spacing',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional letter_spacing override per row.'
      },
      {
        key: 'prop_line_spacing',
        label: 'Overrides: Properties → Line Spacing',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional line_spacing override per row.'
      },
      {
        key: 'prop_img_url',
        label: 'Overrides: Properties → Image URL',
        type: 'string',
        required: false,
        list: true,
        helpText: 'Line items. Optional img_url override per row.'
      },
      {
        key: 'prop_opacity',
        label: 'Overrides: Properties → Opacity',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional opacity override per row (0.0–1.0).'
      },
      {
        key: 'prop_flip_horizontal',
        label: 'Overrides: Properties → Flip Horizontal',
        type: 'boolean',
        required: false,
        list: true,
        helpText: 'Line items. Optional flip_horizontal override per row.'
      },
      {
        key: 'prop_flip_vertical',
        label: 'Overrides: Properties → Flip Vertical',
        type: 'boolean',
        required: false,
        list: true,
        helpText: 'Line items. Optional flip_vertical override per row.'
      },
      {
        key: 'prop_width',
        label: 'Overrides: Properties → Width',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional width override per row.'
      },
      {
        key: 'prop_height',
        label: 'Overrides: Properties → Height',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional height override per row.'
      },
      {
        key: 'prop_color',
        label: 'Overrides: Properties → Color',
        type: 'string',
        required: false,
        list: true,
        helpText: 'Line items. Optional color override per row (hex like #RRGGBB).'
      },
      {
        key: 'prop_rotation',
        label: 'Overrides: Properties → Rotation',
        type: 'number',
        required: false,
        list: true,
        helpText: 'Line items. Optional rotation override per row (degrees).'
      },
      {
        key: 'width',
        label: 'Width (px)',
        type: 'integer',
        required: false,
        helpText: 'Custom width for the variant. Leave empty to use template width.'
      },
      {
        key: 'height',
        label: 'Height (px)',
        type: 'integer',
        required: false,
        helpText: 'Custom height for the variant. Leave empty to use template height.'
      },
      {
        key: 'export_type',
        label: 'Export Format',
        type: 'string',
        required: false,
        default: 'png',
        choices: ['png', 'jpeg', 'pdf', 'webp'],
        helpText: 'The format to export the variant in.'
      }
    ],

    perform: perform,

    sample: {
      id: '323e4567-e89b-12d3-a456-426614174002',
      template_id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://example.com/variant.png',
      width: 1080,
      height: 1080,
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
    },

    outputFields: [
      { key: 'id', label: 'Variant ID', type: 'string' },
      { key: 'template_id', label: 'Template ID', type: 'string' },
      { key: 'url', label: 'Variant URL', type: 'string' },
      { key: 'width', label: 'Width (px)', type: 'integer' },
      { key: 'height', label: 'Height (px)', type: 'integer' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' }
    ]
  }
};

