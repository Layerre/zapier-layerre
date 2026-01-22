# Layerre Zapier Integration

Open source Zapier integration for [Layerre](https://layerre.com) - Create dynamic image variants from Canva templates.

## Overview

This is the complete Zapier integration code for Layerre, released as an open source repository for developers to reference and learn from.

## Features

### Actions
- **Create Template** - Import a Canva design as a Layerre template
- **Delete Template** - Remove a template from your account
- **Create Variant** - Generate a personalized variant with custom layer overrides
- **Delete Variant** - Remove a variant

### Triggers
- **List Templates** - Get all your templates
- **List Variants** - Get all variants for a template
- **List Layers** - Get all layers for a template

### Searches
- **Get Template** - Find a specific template by ID
- **Get Variant** - Find a specific variant by ID

## Development Setup

### Prerequisites
- Node.js >= 18
- npm >= 9
- A [Layerre account with API access](https://layerre.com/app)
- Zapier CLI installed globally: `npm install -g zapier-platform-cli`

### Installation

1. Clone this repository and navigate to the directory:
```bash
cd zapier-layerre
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
# Your Layerre API key
API_KEY=your_api_key_here

# Sample Canva URL for testing
CANVA_URL=https://www.canva.com/design/...
```

4. Link your Zapier account:
```bash
zapier-platform login
```

## Local Testing & Development

### Running Tests

Test the integration locally:
```bash
npm test
```

Or use the Zapier CLI for local testing:
```bash
zapier-platform test
```

### Testing Authentication

Validate your authentication setup locally:
```bash
zapier-platform test --include authentication.test.js
```

### Local Development Testing

You can test individual actions locally:
```bash
zapier-platform invoke creates.create_template --inputData '{"canva_url": "https://www.canva.com/design/..."}'
```

## Authentication

This integration uses API Key authentication with Bearer tokens. Users will need to:
1. Log into their Layerre account
2. Generate an API key
3. Paste the API key when connecting the integration in Zapier

## Support

- **API Reference**: https://layerre.com/docs
- **Support Email**: hello@layerre.com
- **Zapier Platform Docs**: https://zapier.github.io/zapier-platform/

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Version History

- **1.0.0** - Initial release with template and variant management
