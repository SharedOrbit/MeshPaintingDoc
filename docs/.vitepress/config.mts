import { defineConfig } from 'vitepress'

const documentationReleaseTimestamp = Date.parse('2026-08-15T12:00:00+03:00')

export default defineConfig({
  title: 'Mesh Painting',
  description: 'GPU-powered runtime mesh painting for Unreal Engine with static and skeletal mesh support, seam-safe UV projection, and multiplayer-ready paint replication.',
  base: '/MeshPaintingDoc/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  appearance: false,

  transformPageData(pageData) {
    if (!pageData.isNotFound) {
      return { lastUpdated: documentationReleaseTimestamp }
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/MeshPaintingDoc/icon.png' }],
    ['meta', { name: 'theme-color', content: '#151515' }],
    ['meta', { property: 'og:title', content: 'Mesh Painting - Runtime & Multiplayer Ready' }],
    ['meta', { property: 'og:description', content: 'GPU-powered runtime mesh painting for Unreal Engine with static and skeletal mesh support, seam-safe UV projection, and multiplayer-ready paint replication.' }]
  ],

  themeConfig: {
    logo: '/icon.png',
    siteTitle: 'Mesh Painting',

    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Quick Start', link: '/guide/quick-start' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Demo', link: '/demo' },
      { text: 'Multiplayer', link: '/systems/multiplayer' },
      { text: 'Troubleshooting', link: '/reference/troubleshooting' },
      { text: 'Contact', link: '/contact' }
    ],

    sidebar: [
      {
        text: 'Product',
        items: [
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Version Updates', link: '/reference/changelog' },
          { text: 'Demo', link: '/demo' },
          { text: 'Troubleshooting', link: '/reference/troubleshooting' },
          { text: 'Contact', link: '/contact' }
        ]
      },
      {
        text: 'Getting Started',
        items: [
          { text: 'Quick Start', link: '/guide/quick-start' },
          { text: 'Material Setup', link: '/guide/material-setup' }
        ]
      },
      {
        text: 'Systems',
        items: [
          { text: 'Paint Target', link: '/systems/paint-target' },
          { text: 'Painting Controller', link: '/systems/painting-controller' },
          { text: 'Save / Load Paint', link: '/systems/save-load' },
          { text: 'Export Painted Textures', link: '/systems/export-painted-textures' },
          { text: 'Color Picker', link: '/systems/color-picker' },
          { text: 'Multiplayer', link: '/systems/multiplayer' }
        ]
      }
    ],

    outline: {
      level: [2, 3]
    },

    footer: {
      message: 'Runtime Mesh Painting documentation.',
      copyright: 'Copyright Shared Orbit'
    }
  }
})
