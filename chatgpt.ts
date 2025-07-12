import { spawnSync } from "node:child_process";

export type AskChatGPTResult =
  | { readonly ok: true; output: string }
  | { readonly ok: false; error: string }

export function askChatGPT(
  shortcutName: string,
  inputFilePath: string
): AskChatGPTResult {
  try {
    const res = spawnSync(
      "shortcuts",
      ["run", shortcutName, "-i", inputFilePath],
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