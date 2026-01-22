'use strict';

// Test the API key by fetching the user's templates
// This verifies the API key is valid and has proper permissions
const test = (z, bundle) => {
  return z.request({
    url: 'https://api.layerre.com/v1/templates',
    params: { limit: 1 }
  });
};

module.exports = {
  type: 'custom',
  
  // Define fields for authentication
  fields: [
    {
      key: 'api_key',
      label: 'API Key',
      required: true,
      type: 'string',
      helpText: 'Your Layerre API key. Find it in your Layerre dashboard: `https://layerre.com/app`.'
    },
    {
      key: 'connection_name',
      label: 'Connection Name',
      required: false,
      type: 'string',
      helpText: 'Optional name to help you identify this Layerre connection in Zapier (e.g. "Prod", "Client1"). Do not include http://, https://, or any domain names. [Learn more about API keys](https://layerre.com/docs)',
      validate: (value) => {
        if (!value) return true; // Empty value is allowed

        // Basic validation: only letters and numbers
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          return 'Connection name can only contain letters and numbers.';
        }

        return true;
      }
    }
  ],
  
  // The test method verifies credentials
  test: test,

  // Connection label shown in Zapier UI
  // Zapier recommends including at least one variable in the label, but it should not include sensitive data.
  connectionLabel: 'Layerre ({{bundle.authData.connection_name}})'
};