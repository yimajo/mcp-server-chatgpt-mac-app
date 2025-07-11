# mcp-server-chatgpt-mac-app

This is an MCP server that allows you to use the ChatGPT macOS app via MCP.
The original version was written in Python as [mcp-server-chatgpt-app](https://github.com/cdpath/mcp-server-chatgpt-app),
and this project is a TypeScript implementation of it.

## Prerequisite

- [ChatGPT macOS app](https://openai.com/chatgpt/download/)
- [Install the "Ask ChatGPT on Mac" shortcuts](https://www.icloud.com/shortcuts/f8f249e8fce7450291f385874c64c6eb)
- Node.js

## Using npx

The MCP server can be used via npx,
and you can choose to use it either globally on your macOS system or within any local project.

### Global Usage

If you want to use it globally, run the following command in your CLI.

```bash
claude mcp add chatGPTOnMac -s user \
  -- npx mcp-server-chatgpt-mac-app
```

### Local Project Usage

If you want to use it in any local directory,
add the following to your `.mcp.json`.

```json
{
  "mcpServers": {
    "chatGPTOnMac": {
      "command": "npx",
      "args": ["mcp-server-chatgpt-mac-app"],
      "cwd": ".",
      "env": {}
    }
  }
}
```

### How to check if the MCP server has been added

To verify that the MCP server has been added, run the following command:

```bash
claude mcp list
```

If the output looks like the following, everything is set up correctly.

```bash
$ claude mcp list
chatGPTOnMac: npx mcp-server-chatgpt-mac-app
```

## Local Development

If you want to improve this project locally.

### build

```bash
git clone https://github.com/yimajo/mcp-server-chatgpt-mac-app.git
cd mcp-server-chatgpt-mac-app
pnpm install
pnpm build
```
