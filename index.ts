#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { randomUUID } from "node:crypto"
import { unlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { z } from "zod"
import { askChatGPT } from "./chatgpt.js"

// You need to create a shortcut in the macOS Shortcuts.app with this name.
const CHATGPT_SHORTCUT_NAME = "Ask ChatGPT on Mac"

// MARK: - MCP Server

const server = new McpServer({
  name: "mcp-server-chatgpt-mac-app",
  version: "0.1.0",
})

// MARK: - ChatGPT via Shortcuts (CLI)

// MARK: - Server Tool

server.tool(
  "ask_via_shortcuts_cli",
  "An AI agent that utilizes the ChatGPT app for macOS.",
  {
    prompt: z.string().describe("Send to ChatGPT"),
  },
  async ({ prompt }) => {
    const inputFilePath = join(
      tmpdir(),
      `chatgpt-${randomUUID()}.txt`,
    )
    writeFileSync(inputFilePath, prompt, "utf8")

    try {
      const res = askChatGPT(CHATGPT_SHORTCUT_NAME, inputFilePath)
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
    } finally {
      unlinkSync(inputFilePath)
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
