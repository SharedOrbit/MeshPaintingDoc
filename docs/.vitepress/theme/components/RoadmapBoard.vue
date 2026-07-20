<script setup lang="ts">
type RoadmapCard = {
  title: string
  status: string
  description: string
  completed?: boolean
}

type RoadmapSection = {
  id: string
  nav: string
  title: string
  cards: RoadmapCard[]
}

const sections: RoadmapSection[] = [
  {
    id: 'next-update',
    nav: 'NEXT UPDATE',
    title: 'Next Update',
    cards: [
      {
        title: 'Demo Video',
        status: 'Next',
        description: 'A short video showing static mesh painting, skeletal mesh painting, color picking, eraser mode, and multiplayer replication.'
      },
      {
        title: 'Sample Project',
        status: 'Next',
        description: 'A minimal Unreal sample scene with a configured paint target, material setup, input mapping, and runtime paint controller.'
      },
      {
        title: 'Material Examples',
        status: 'Docs',
        description: 'Extra material examples for color-only painting, material setting painting, opacity blending, and packed metallic/roughness workflows.'
      }
    ]
  },
  {
    id: 'planned',
    nav: 'PLANNED',
    title: 'Planned',
    cards: [
      {
        title: 'Brush Presets',
        status: 'Planned',
        description: 'Reusable brush presets for size, opacity, hardness, material settings, and eraser behavior.'
      },
      {
        title: 'Advanced Multiplayer Notes',
        status: 'Docs',
        description: 'More examples for listen server, dedicated server, late join replay, and low bandwidth paint command replication.'
      },
      {
        title: 'Packaging Checklist',
        status: 'Docs',
        description: 'A focused checklist for plugin content, shader loading, supported platforms, and packaged build validation.'
      }
    ]
  },
  {
    id: 'research',
    nav: 'RESEARCH',
    title: 'Research',
    cards: [
      {
        title: 'More Brush Shapes',
        status: 'Research',
        description: 'Investigating additional brush masks and falloff styles without changing the current runtime GPU paint path.'
      },
      {
        title: 'Extra Platform Testing',
        status: 'Research',
        description: 'Windows is the current tested target. Other platforms should only be listed after shader, render target, and packaging validation.'
      },
      {
        title: 'Editor Utility Helpers',
        status: 'Research',
        description: 'Possible optional editor helpers for preparing materials and checking paint target setup before runtime.'
      }
    ]
  },
  {
    id: 'completed',
    nav: 'COMPLETED',
    title: 'Completed',
    cards: [
      {
        title: 'Runtime GPU Painting',
        status: 'Done',
        completed: true,
        description: 'Brush painting is applied through a runtime GPU path using persistent render targets.'
      },
      {
        title: 'UV Island Clipping',
        status: 'Done',
        completed: true,
        description: 'Large brushes are clipped to the valid painted surface so unrelated UV islands are protected.'
      },
      {
        title: 'Late Join Multiplayer',
        status: 'Done',
        completed: true,
        description: 'Paint command history is replayed for late join clients instead of replicating raw render target textures.'
      }
    ]
  }
]
</script>

<template>
  <div class="roadmap-page">
    <nav class="roadmap-tabs" aria-label="Roadmap sections">
      <a v-for="section in sections" :key="section.id" :href="`#${section.id}`">
        {{ section.nav }}
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
            <span class="roadmap-card-status" :class="{ completed: card.completed }">
              {{ card.status }}
            </span>
          </summary>
          <p>{{ card.description }}</p>
        </details>
      </div>
    </section>
  </div>
</template>
