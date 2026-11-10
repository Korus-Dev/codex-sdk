import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Codex SDK',
  titleTemplate: ':title · Codex SDK',
  description: 'Build apps on Codex with a typed app-server client and Node.js transports.',
  lang: 'en-US',
  base: '/',
  cleanUrls: false,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0b7a65' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Codex SDK',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        { text: 'Get started', items: [
          { text: 'Overview', link: '/guide/' },
          { text: 'Setup', link: '/guide/installation' },
          { text: 'First conversation', link: '/guide/quick-start' },
          { text: 'Architecture', link: '/guide/architecture' },
        ] },
        { text: 'Use Codex', items: [
          { text: 'Threads and turns', link: '/guide/conversations' },
          { text: 'Authentication', link: '/guide/authentication' },
          { text: 'Approvals and tools', link: '/guide/extensions' },
          { text: 'MCP servers', link: '/guide/mcp' },
          { text: 'Host security', link: '/guide/security' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
        ] },
        { text: 'Contribute', items: [
          { text: 'Development and schema', link: '/guide/development' },
          { text: 'Testing', link: '/guide/testing' },
        ] },
      ],
      '/api/': [{ text: 'API reference', items: [
        { text: 'Exports', link: '/api/' },
        { text: 'Client', link: '/api/codex' },
        { text: 'Transports and discovery', link: '/api/transports' },
        { text: 'Protocol inventory', link: '/api/json-rpc' },
      ] }],
    },
    search: { provider: 'local', options: { detailedView: true } },
    outline: { level: [2, 3] },
    editLink: { pattern: 'https://github.com/Korus-Dev/codex-sdk/edit/main/docs/:path' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Korus-Dev/codex-sdk' }],
    footer: { message: 'Released under the Apache License 2.0.', copyright: 'Copyright © 2026-present Nicolas Bonamy' },
  },
  markdown: { lineNumbers: true, theme: { light: 'github-light', dark: 'github-dark' } },
});
