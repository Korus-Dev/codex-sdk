import { defineConfig } from 'vitepress';

const base = '/codex-sdk/';

export default defineConfig({
  title: 'Codex SDK',
  titleTemplate: ':title · Codex SDK',
  description: 'Build apps on Codex with a typed app-server client and Node.js transports.',
  lang: 'en-US',
  base,
  cleanUrls: false,
  lastUpdated: true,
  sitemap: { hostname: 'https://korus-dev.github.io/codex-sdk/' },
  head: [
    ['meta', { name: 'theme-color', content: '#0b7a65' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Codex SDK' }],
    ['meta', {
      property: 'og:description',
      content: 'A typed Codex app-server client and Node.js transports for streaming conversations, approvals, and tools.',
    }],
    ['link', { rel: 'icon', href: `${base}logo.svg`, type: 'image/svg+xml' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Codex SDK',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/guide/examples' },
      { text: 'npm', link: 'https://www.npmjs.com/package/@korus-dev/codex-sdk' },
      { text: 'Changelog', link: 'https://github.com/Korus-Dev/codex-sdk/blob/main/CHANGELOG.md' },
    ],
    sidebar: {
      '/guide/': [
        { text: 'Get started', collapsed: false, items: [
          { text: 'Why Codex SDK', link: '/guide/' },
          { text: 'Setup', link: '/guide/installation' },
          { text: 'First conversation', link: '/guide/quick-start' },
          { text: 'Connect to Codex', link: '/guide/connecting' },
          { text: 'Architecture', link: '/guide/architecture' },
        ] },
        { text: 'Conversations', collapsed: false, items: [
          { text: 'Stream events', link: '/guide/streaming' },
          { text: 'Threads and turns', link: '/guide/conversations' },
          { text: 'Approvals and tools', link: '/guide/extensions' },
          { text: 'Authentication', link: '/guide/authentication' },
        ] },
        { text: 'Integrate', collapsed: false, items: [
          { text: 'MCP servers', link: '/guide/mcp' },
          { text: 'Remote control', link: '/guide/remote-control' },
          { text: 'Reconnect and recover', link: '/guide/recovery' },
          { text: 'Examples', link: '/guide/examples' },
        ] },
        { text: 'Ship with confidence', collapsed: false, items: [
          { text: 'Host security', link: '/guide/security' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          { text: 'Development and schema', link: '/guide/development' },
          { text: 'Testing', link: '/guide/testing' },
        ] },
      ],
      '/api/': [{ text: 'API reference', collapsed: false, items: [
        { text: 'Exports', link: '/api/' },
        { text: 'Client', link: '/api/codex' },
        { text: 'Transports and discovery', link: '/api/transports' },
        { text: 'Wire types and errors', link: '/api/wire' },
        { text: 'Protocol inventory', link: '/api/json-rpc' },
      ] }],
    },
    search: { provider: 'local', options: { detailedView: true } },
    outline: { level: [2, 3], label: 'On this page' },
    editLink: { pattern: 'https://github.com/Korus-Dev/codex-sdk/edit/main/docs/:path', text: 'Improve this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Korus-Dev/codex-sdk' }],
    footer: { message: 'Released under the Apache License 2.0.', copyright: 'Copyright © 2026-present Nicolas Bonamy' },
  },
  markdown: { lineNumbers: true, theme: { light: 'github-light', dark: 'github-dark' } },
});
