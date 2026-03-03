import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import { SHANNON_RE_BINARY_DESCRIPTION } from "./constants"
import { DockerManager } from "../../docker"

export function createShannonReBinary(): ToolDefinition {
  return tool({
    description: SHANNON_RE_BINARY_DESCRIPTION,
    args: {
      target: tool.schema
        .string()
        .describe("Path to binary file in workspace or URL to download (e.g., /workspace/binary.elf or https://example.com/binary)"),
      command: tool.schema
        .string()
        .describe(
          "Reverse engineering command to run. " +
            "Example: rizin -c 'aaa; afl' /workspace/binary or strings -n 8 /workspace/binary"
        ),
      timeout: tool.schema
        .number()
        .optional()
        .describe("Timeout in milliseconds (default: 300000)"),
    },
    async execute(args) {
      const docker = DockerManager.getInstance()
      await docker.ensureRunning()

      const result = await docker.exec(args.command, args.timeout)

      const output = [
        `## Binary Reverse Engineering Output`,
        `**Target**: ${args.target}`,
        `**Command**: \`${args.command}\``,
        `**Exit Code**: ${result.exitCode}`,
        `**Duration**: ${result.duration}ms`,
        "",
      ]

      if (result.stdout) {
        output.push("### stdout", "```", result.stdout.trim(), "```", "")
      }

      if (result.stderr) {
        output.push("### stderr", "```", result.stderr.trim(), "```", "")
      }

      return output.join("\n")
    },
  })
}
