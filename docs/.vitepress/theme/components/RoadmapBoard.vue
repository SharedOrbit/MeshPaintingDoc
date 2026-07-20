<script setup lang="ts">
type RoadmapCard = {
  title: string
  description: string
  imageTone?: 'blue' | 'orange' | 'green' | 'gray'
  imageLabel?: string
  completed?: boolean
}

type RoadmapSection = {
  id: string
  title: string
  cards: RoadmapCard[]
}

const tabs = [
  'MESH PAINTING 1.4',
  'MESH PAINTING 1.3',
  'MESH PAINTING 1.2',
  'MESH PAINTING 1.1',
  'MESH PAINTING 1.0'
]

const sections: RoadmapSection[] = [
  {
    id: 'next-update',
    title: 'Next Update',
    cards: [
      {
        title: 'Demo Video',
        imageTone: 'blue',
        imageLabel: 'Runtime Paint Demo',
        description: 'A short video showing static mesh painting, skeletal mesh painting, color picking, eraser mode, and multiplayer replication.'
      },
      {
        title: 'Sample Project',
        imageTone: 'orange',
        imageLabel: 'Example Level',
        description: 'A minimal Unreal sample scene with a configured paint target, material setup, input mapping, and runtime paint controller.'
      },
      {
        title: 'Material Examples',
        imageTone: 'gray',
        imageLabel: 'Material Graph',
        description: 'Extra material examples for color-only painting, material setting painting, opacity blending, and packed metallic/roughness workflows.'
      }
    ]
  },
  {
    id: 'planned',
    title: 'Planned',
    cards: [
      {
        title: 'Brush Presets',
        imageTone: 'blue',
        imageLabel: 'Brush Presets',
        description: 'Reusable brush presets for size, opacity, hardness, material settings, and eraser behavior.'
      },
      {
        title: 'Advanced Multiplayer Notes',
        imageTone: 'green',
        imageLabel: 'Replication Flow',
        description: 'More examples for listen server, dedicated server, late join replay, and low bandwidth paint command replication.'
      },
      {
        title: 'Packaging Checklist',
        imageTone: 'gray',
        imageLabel: 'Shipping Build',
        description: 'A focused checklist for plugin content, shader loading, supported platforms, and packaged build validation.'
      }
    ]
  },
  {
    id: 'research',
    title: 'Research',
    cards: [
      {
        title: 'More Brush Shapes',
        imageTone: 'orange',
        imageLabel: 'Brush Masks',
        description: 'Investigating additional brush masks and falloff styles without changing the current runtime GPU paint path.'
      },
      {
        title: 'Extra Platform Testing',
        imageTone: 'gray',
        imageLabel: 'Platform Testing',
        description: 'Windows is the current tested target. Other platforms should only be listed after shader, render target, and packaging validation.'
      },
      {
        title: 'Editor Utility Helpers',
        imageTone: 'blue',
        imageLabel: 'Editor Helpers',
        description: 'Possible optional editor helpers for preparing materials and checking paint target setup before runtime.'
      }
    ]
  },
  {
    id: 'completed',
    title: 'Completed',
    cards: [
      {
        title: 'Runtime GPU Painting',
        imageTone: 'blue',
        imageLabel: 'GPU Painting',
        completed: true,
        description: 'Brush painting is applied through a runtime GPU path using persistent render targets.'
      },
      {
        title: 'UV Island Clipping',
        imageTone: 'green',
        imageLabel: 'UV Island Clip',
        completed: true,
        description: 'Large brushes are clipped to the valid painted surface so unrelated UV islands are protected.'
      },
      {
        title: 'Late Join Multiplayer',
        imageTone: 'orange',
        imageLabel: 'Late Join Replay',
        completed: true,
        description: 'Paint command history is replayed for late join clients instead of replicating raw render target textures.'
      }
    ]
  }
]
</script>

<template>
  <div class="roadmap-page">
    <nav class="roadmap-tabs" aria-label="Roadmap versions">
      <a
        v-for="(tab, index) in tabs"
        :key="tab"
        :class="{ active: index === 1 }"
        href="#next-update"
      >
        {{ tab }}
      </a>
    </nav>

    <section
      v-for="section in sections"
      :id="section.id"
      :key="section.id"
      class="roadmap-section"
    >
      <div class="roadmap-section-title">{{ section.title }}</div>
      <div class="roadmap-grid">
        <details v-for="card in section.cards" :key="card.title" class="roadmap-card">
          <summary>
            <span class="roadmap-card-title">{{ card.title }}</span>
            <span
              class="roadmap-card-image"
              :class="[`tone-${card.imageTone || 'gray'}`, { completed: card.completed }]"
            >
              <span class="roadmap-card-image-label">{{ card.imageLabel || card.title }}</span>
            </span>
          </summary>
          <p>{{ card.description }}</p>
        </details>
      </div>
    </section>
  </div>
</template>
