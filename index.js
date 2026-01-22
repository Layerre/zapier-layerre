const authentication = require('./authentication');
const { befores = [], afters = [] } = require('./middleware');

// Import creates (actions)
const createTemplate = require('./creates/create_template');
const deleteTemplate = require('./creates/delete_template');
const createVariant = require('./creates/create_variant');
const deleteVariant = require('./creates/delete_variant');

// Import searches
const getTemplate = require('./searches/get_template');
const getVariant = require('./searches/get_variant');

// Import triggers
const listTemplatesTrigger = require('./triggers/list_templates');
const listVariantsTrigger = require('./triggers/list_variants');
const listLayersTrigger = require('./triggers/list_layers');

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  flags: {
    cleanInputData: false
  },

  authentication,

  // App-level middleware (Zapier schema does not allow authentication.beforeRequest)
  beforeRequest: [...befores],

  afterResponse: [...afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [listTemplatesTrigger.key]: listTemplatesTrigger,
    [listVariantsTrigger.key]: listVariantsTrigger,
    [listLayersTrigger.key]: listLayersTrigger
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    [getTemplate.key]: getTemplate,
    [getVariant.key]: getVariant
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [createTemplate.key]: createTemplate,
    [deleteTemplate.key]: deleteTemplate,
    [createVariant.key]: createVariant,
    [deleteVariant.key]: deleteVariant
  },

  resources: {}
};
