import { tool, type ToolDefinition } from "@opencode-ai/plugin"

export function createShannonApiFuzzer(): ToolDefinition {
  return tool({
    description:
      "Schema-aware fuzzer for modern APIs (GraphQL, gRPC, REST). Detects introspection leaks and BOLA.",
    args: {
      _placeholder: tool.schema
        .boolean()
        .describe("Placeholder. Always pass true."),
    },
    async execute(_args) {
      return [
        "## Shannon API Fuzzer",
        "",
        "API fuzzer tool is ready.",
        "Use shannon_exec to run API fuzzing commands manually.",
        "",
        "### Suggested Tests",
        "- GraphQL introspection: query { __schema { types { name } } }",
        "- REST BOLA: enumerate resource IDs with shannon_idor_test",
        "- gRPC reflection: grpcurl -plaintext target list",
        "- Analyze schema for sensitive fields (password, role, is_admin).",
      ].join("\n")
    },
  })
}
