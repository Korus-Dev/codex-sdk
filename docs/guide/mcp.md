# MCP servers

Codex app-server owns its MCP connections. Supply the intended Codex configuration through the stdio transport's `configOverrides`, an isolated `codexHome`, or typed configuration requests supported by your running server.

Overrides are forwarded as `-c` arguments in caller order. Values must follow the configuration format expected by that Codex version. The transport adds no implicit feature flags.

The protocol includes `mcpServerStatus/list` to inspect servers and `config/mcpServer/reload` to request configuration reload. Follow the generated request and response types and handle their remote errors. Your app owns server command/URL validation, credentials, and approval decisions.

See the [protocol inventory](/api/json-rpc) for the available MCP methods. The SDK provides transport and typing; the running Codex server supplies the MCP implementation.

## Configure an app-owned server

Pass explicit Codex configuration when constructing the stdio transport:

```ts
const transport = new CodexAppServerStdioTransport({
  codexHome: '/absolute/path/to/app-codex-home',
  configOverrides: [
    'mcp_servers.knowledge.url="https://mcp.example.com/mcp"',
    'mcp_servers.knowledge.enabled_tools=["search_docs","read_document"]',
  ],
});
```

A local stdio MCP server uses the corresponding `mcp_servers.<name>.command` and `args` settings. Values are TOML expressions interpreted by Codex; build them in trusted host code and validate names and destinations before interpolation. The SDK forwards each override as a separate argument, without shell evaluation. Do not confuse the Codex app-server process with an MCP server process: Codex launches and manages the latter.

## Inspect and authenticate

After initialization, request `mcpServerStatus/list` and follow its cursor for additional pages. Inspect each server's `runtimeStatus`, tools, resources, and `authStatus`; an empty tool catalog and a discovery error are different states. Use `mcpServer/oauth/login` for servers requiring OAuth, and observe `mcpServer/oauthLogin/completed` before refreshing status. The host presents any returned authorization URL.

`config/mcpServer/reload` asks the running server to reload its configuration. Configuration changes and tool availability are server behavior; inspect the RPC result and subsequent status rather than updating a local optimistic catalog. Use dynamic tools for a small host function that needs no independent MCP service.
