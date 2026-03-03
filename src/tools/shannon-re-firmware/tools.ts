import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import { SHANNON_RE_FIRMWARE_DESCRIPTION } from "./constants"
import { DockerManager } from "../../docker"

export function createShannonReFirmware(): ToolDefinition {
  return tool({
    description: SHANNON_RE_FIRMWARE_DESCRIPTION,
    args: {
      target: tool.schema
        .string()
        .describe("Path to firmware file in workspace (e.g., /workspace/firmware.bin)"),
      command: tool.schema
        .string()
        .describe(
          "Firmware reverse engineering command to run. " +
            "Example: binwalk -e /workspace/firmware.bin"
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
        `## Firmware Reverse Engineering Output`,
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
