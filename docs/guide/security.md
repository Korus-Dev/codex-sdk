# Host security

Run the client in your trusted Node.js host. Choose executable paths, environment variables, `cwd`, `codexHome`, and configuration overrides there. Those inputs determine which process runs, which identity it uses, and which files and services it can access.

Your app owns approvals and tool authorization. Validate incoming tool arguments before performing app actions. A generated TypeScript type describes the protocol; it does not validate arbitrary input at runtime.

For apps serving multiple users, bind each connection to an authorized identity and Codex home. Keep credentials and protocol payloads out of logs. The request-settled hook exposes method, ID, outcome, and timing only; stderr and remote errors can still contain sensitive server output.

If a renderer or remote client needs access, expose a host-owned API with the actions you intend to allow. Keep raw process configuration and credentials inside the host.
