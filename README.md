# shopifyenv

Easily manage multiple environments while developing Shopify extensions. shopifyenv lets you use environment variables from .env files in your Shopify extension code.

## Installation

### Global Installation

```bash
npm install -g shopifyenv
```

This will install the `shopifyenv` command globally on your system.

### Local Installation

```bash
npm install shopifyenv
```

When installed locally, you can run the commands using npx:

```bash
npx shopifyenv init
npx shopifyenv use development
```

## Usage

### Initialize Configuration

First, initialize shopifyenv in your project directory:

```bash
shopifyenv init
```

This will:
- Scan your project directory for `.env.*` files
- Create a `shopifyenv.json` configuration file
- Detect all environment variables across your environment files

### Switch Environments

To switch to a specific environment:

```bash
shopifyenv use <env_name>
```

For example:

```bash
shopifyenv use development
shopifyenv use production
shopifyenv use staging
```

This will:
- Read the `.env.<env_name>` file from your project directory
- Update the configuration to track the current environment
- Make the environment variables from that file active

## Environment Files

shopifyenv works with standard `.env.<environment>` files:

- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env.staging` - Staging environment variables
- etc.

Each file should contain environment variables in the standard format:

```
KEY=value
ANOTHER_KEY=another_value
```

## Configuration

shopifyenv creates and maintains a `shopifyenv.json` file in your project directory that tracks:

- The currently selected environment
- All available environments and when they were last used
- All environment variable keys detected across all environments

This configuration helps shopifyenv manage your environment variables effectively.

## License

ISC