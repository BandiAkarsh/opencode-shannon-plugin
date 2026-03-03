import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import { SHANNON_RE_REPORT_DESCRIPTION } from "./constants"

export function createShannonReReport(): ToolDefinition {
  return tool({
    description: SHANNON_RE_REPORT_DESCRIPTION,
    args: {
      findings: tool.schema
        .string()
        .describe(
          "Reverse engineering findings to include in the report. Can be previous tool outputs, " +
            "analysis results, vulnerability descriptions, IOCs, etc."
        ),
      target: tool.schema
        .string()
        .describe(
          "Name or identifier of the analyzed target (e.g., 'MyApp.apk', 'firmware-v2.1.bin', 'malware-sample')"
        ),
      analysis_type: tool.schema
        .enum(["binary", "mobile", "firmware", "malware", "mixed"])
        .optional()
        .default("mixed")
        .describe("Type of reverse engineering analysis performed"),
      format: tool.schema
        .enum(["markdown", "json"])
        .optional()
        .default("markdown")
        .describe("Output format for the report"),
    },
    async execute(args) {
      const timestamp = new Date().toISOString()
      
      const reportSections = [
        `# Reverse Engineering Security Analysis Report`,
        `**Target**: ${args.target}`,
        `**Analysis Type**: ${args.analysis_type}`,
        `**Generated**: ${timestamp}`,
        "",
        `---`,
        "",
        `## Executive Summary`,
        "",
        `This report documents the findings from reverse engineering analysis of: **${args.target}**`,
        "",
        `**Analysis Scope**: ${args.analysis_type === 'mixed' ? 'Multiple analysis types' : args.analysis_type} reverse engineering`,
        "",
        `---`,
        "",
        `## Analysis Findings`,
        "",
        args.findings,
        "",
        `---`,
        "",
        `## Recommendations`,
        "",
        `Based on the analysis, the following actions are recommended:`,
        "",
        `1. Review all identified vulnerabilities and assess risk`,
        `2. Implement security controls for detected issues`,
        `3. Update components to secure versions where applicable`,
        `4. Monitor identified IOCs if applicable`,
        `5. Conduct follow-up testing after remediation`,
        "",
        `---`,
        "",
        `## Appendix: Analysis Metadata`,
        "",
        `- **Analysis Date**: ${timestamp}`,
        `- **Target**: ${args.target}`,
        `- **Type**: ${args.analysis_type}`,
        `- **Report Format**: ${args.format}`,
      ]

      const report = reportSections.join("\n")

      const output = [
        `## Reverse Engineering Report Generated`,
        `**Target**: ${args.target}`,
        `**Analysis Type**: ${args.analysis_type}`,
        `**Format**: ${args.format}`,
        `**Timestamp**: ${timestamp}`,
        "",
        "---",
        "",
        report,
      ]

      return output.join("\n")
    },
  })
}
