import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Mesh Painting',
  description: 'Runtime and multiplayer-ready mesh painting for Unreal Engine.',
  base: '/MeshPaintingDoc/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  appearance: false,

  head: [
    ['link', { rel: 'icon', href: '/MeshPaintingDoc/icon.png' }],
    ['meta', { name: 'theme-color', content: '#1d4ed8' }],
    ['meta', { property: 'og:title', content: 'Mesh Painting - Runtime & Multiplayer Ready' }],
    ['meta', { property: 'og:description', content: 'GPU-based runtime mesh painting plugin for Unreal Engine static and skeletal meshes.' }]
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
      { text: 'About', link: '/about' },
      { text: 'Contact', link: '/contact' }
    ],

    sidebar: [
      {
        text: 'Product',
        items: [
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Demo', link: '/demo' },
          { text: 'About', link: '/about' },
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
          { text: 'Paint Target Component', link: '/systems/paint-target' },
          { text: 'Painting Controller', link: '/systems/painting-controller' },
          { text: 'Color Picker', link: '/systems/color-picker' },
          { text: 'Multiplayer', link: '/systems/multiplayer' },
          { text: 'Packaging', link: '/systems/packaging' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Blueprint API', link: '/api/blueprint' },
          { text: 'Troubleshooting', link: '/reference/troubleshooting' },
          { text: 'Changelog', link: '/reference/changelog' },
          { text: 'Support', link: '/support' }
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
