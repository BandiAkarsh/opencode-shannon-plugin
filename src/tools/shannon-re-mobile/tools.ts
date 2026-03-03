import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import { SHANNON_RE_MOBILE_DESCRIPTION } from "./constants"
import { DockerManager } from "../../docker"

export function createShannonReMobile(): ToolDefinition {
  return tool({
    description: SHANNON_RE_MOBILE_DESCRIPTION,
    args: {
      target: tool.schema
        .string()
        .describe("Path to mobile app file (APK/IPA) in workspace (e.g., /workspace/app.apk)"),
      command: tool.schema
        .string()
        .describe(
          "Mobile reverse engineering command to run. " +
            "Example: jadx -d /workspace/output /workspace/app.apk"
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
        `## Mobile Reverse Engineering Output`,
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
