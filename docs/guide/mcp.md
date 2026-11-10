# MCP servers

Codex app-server owns its MCP connections. Supply the intended Codex configuration through the stdio transport's `configOverrides`, an isolated `codexHome`, or typed configuration requests supported by your running server.

Overrides are forwarded as `-c` arguments in caller order. Values must follow the configuration format expected by that Codex version. The transport adds no implicit feature flags.

The protocol includes `mcpServerStatus/list` to inspect servers and `config/mcpServer/reload` to request configuration reload. Follow the generated request and response types and handle their remote errors. Your app owns server command/URL validation, credentials, and approval decisions.

See the [protocol inventory](/api/json-rpc) for the available MCP methods. The SDK provides transport and typing; the running Codex server supplies the MCP implementation.
