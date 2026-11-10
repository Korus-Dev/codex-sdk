# Security

Do not disclose vulnerabilities, tokens, pairing codes, or private conversation data in public issues. Report vulnerabilities privately to Nicolas Bonamy at nicolas@bonamy.fr with affected versions, impact, and reproduction steps. Use a minimal reproduction without live credentials.

Use the latest released SDK and select the Codex CLI separately. The schema pin describes generated types, not a guarantee that every server implements every method.

The SDK runs in a trusted Node.js host. Your application must authorize process configuration, tools, approvals, and access to Codex homes. TypeScript declarations do not validate untrusted payloads. See the [host security guide](docs/guide/security.md).
