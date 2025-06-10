<div align="center">
    <img src="https://raw.githubusercontent.com/agentuity/cli/refs/heads/main/.github/Agentuity.png" alt="Agentuity" width="100"/>
    <br/>
    <strong>Build Agents, Not Infrastructure</strong>
    <br/><br/>
</div>

# 🤖 Webapp Agents

A collection of agents used by the Agentuity webapp to help users perform tasks or understand complex data quickly and easily.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Bun**: Version 1.2.4 or higher

## 🚀 Getting Started

### Authentication

Before using Agentuity, you need to authenticate:

```bash
agentuity login
```

This command will open a browser window where you can log in to your Agentuity account.

### Importing This Project

To import this project into your account:

```bash
agentuity project import
```

Follow the interactive prompts to configure your project.

### Development Mode

Run your project in development mode with:

```bash
agentuity dev
```

This will start your project and open a new browser window connecting your agents to the Agentuity Console in DevMode, allowing you to test and debug your agents in real-time.

### Development Mode: Part Deux

This project also contains an HTML test console (`index.html`), which comes pre-loaded with a variety of test cases. To start, edit the URLs and IDs at the top of the HTML file and then open the file in your browser.

## 🌐 Deployment

When you're ready to deploy your agent to the Agentuity Cloud:

```bash
agentuity deploy
```

This command will bundle your agent and deploy it to the cloud, making it accessible via the Agentuity platform.

## 🔧 Configuration

Your project configuration is stored in `agentuity.yaml`. This file defines your agents, development settings, and deployment configuration.

## 📖 Documentation

For comprehensive documentation on the Agentuity JavaScript SDK, visit:
[https://agentuity.dev/SDKs/javascript](https://agentuity.dev/SDKs/javascript)

## 🆘 Troubleshooting

If you encounter any issues:

1. Check the [documentation](https://agentuity.dev/SDKs/javascript)
2. Join our [Discord community](https://discord.gg/agentuity) for support
3. Contact the Agentuity support team

## 📝 License

This project is licensed under the terms specified in the LICENSE file.
