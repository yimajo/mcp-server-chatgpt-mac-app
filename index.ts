#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

// You need to create a shortcut in the macOS Shortcuts.app with this name.
const CHATGPT_SHORTCUT_NAME = "Ask ChatGPT on Mac"

// MARK: - MCP Server

const server = new McpServer({
  name: "mcp-server-chatgpt-mac-app",
  version: "0.0.1",
})

// MARK: - ChatGPT via Shortcuts (CLI)

type AskChatGPTResult =
  | { readonly ok: true; output: string }
  | { readonly ok: false; error: string }

function askChatGPT(prompt: string): AskChatGPTResult {
  try {
    const res = spawnSync(
      "shortcuts",
      ["run", CHATGPT_SHORTCUT_NAME, "-i", prompt],
      { encoding: "utf8" },
    )
    if (res.status === 0) {
      return { ok: true, output: res.stdout.trim() }
    }
    return { ok: false, error: res.stderr.trim() }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

// MARK: - Server Tool

server.tool(
  "ask_via_shortcuts_cli",
  "An AI agent that utilizes the ChatGPT app for macOS.",
  {
    prompt: z.string().describe("Send to ChatGPT"),
  },
  async ({ prompt }) => {
    const res = askChatGPT(prompt)
    if (res.ok) {
      return {
        content: [
          {
            type: "text",
            text: res.output,
          },
        ],
      }
    } else {
      throw new Error(res.error ?? "Unknown error")
    }
  },
)

// MARK: - Main

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exitCode = 1
})
