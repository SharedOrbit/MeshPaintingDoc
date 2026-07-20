<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type RoadmapCard = {
  title: string
  description: string
  imageTone?: 'blue' | 'orange' | 'green' | 'gray'
  imageLabel?: string
  completed?: boolean
  author?: string
  posted?: string
}

type RoadmapSection = {
  id: string
  title: string
  cards: RoadmapCard[]
}

type ActiveRoadmapCard = {
  sectionTitle: string
  card: RoadmapCard
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
        posted: 'Posted on July 2026',
        description: 'A short video showing static mesh painting, skeletal mesh painting, color picking, eraser mode, and multiplayer replication.'
      },
      {
        title: 'Sample Project',
        imageTone: 'orange',
        imageLabel: 'Example Level',
        posted: 'Posted on July 2026',
        description: 'A minimal Unreal sample scene with a configured paint target, material setup, input mapping, and runtime paint controller.'
      },
      {
        title: 'Material Examples',
        imageTone: 'gray',
        imageLabel: 'Material Graph',
        posted: 'Posted on July 2026',
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
        posted: 'Planned for a future update',
        description: 'Reusable brush presets for size, opacity, hardness, material settings, and eraser behavior.'
      },
      {
        title: 'Advanced Multiplayer Notes',
        imageTone: 'green',
        imageLabel: 'Replication Flow',
        posted: 'Planned for a future update',
        description: 'More examples for listen server, dedicated server, late join replay, and low bandwidth paint command replication.'
      },
      {
        title: 'Packaging Checklist',
        imageTone: 'gray',
        imageLabel: 'Shipping Build',
        posted: 'Planned for a future update',
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
        posted: 'Research item',
        description: 'Investigating additional brush masks and falloff styles without changing the current runtime GPU paint path.'
      },
      {
        title: 'Extra Platform Testing',
        imageTone: 'gray',
        imageLabel: 'Platform Testing',
        posted: 'Research item',
        description: 'Windows is the current tested target. Other platforms should only be listed after shader, render target, and packaging validation.'
      },
      {
        title: 'Editor Utility Helpers',
        imageTone: 'blue',
        imageLabel: 'Editor Helpers',
        posted: 'Research item',
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
        posted: 'Completed',
        description: 'Brush painting is applied through a runtime GPU path using persistent render targets.'
      },
      {
        title: 'UV Island Clipping',
        imageTone: 'green',
        imageLabel: 'UV Island Clip',
        completed: true,
        posted: 'Completed',
        description: 'Large brushes are clipped to the valid painted surface so unrelated UV islands are protected.'
      },
      {
        title: 'Late Join Multiplayer',
        imageTone: 'orange',
        imageLabel: 'Late Join Replay',
        completed: true,
        posted: 'Completed',
        description: 'Paint command history is replayed for late join clients instead of replicating raw render target textures.'
      }
    ]
  }
]

const importanceLabels = ['NOT IMPORTANT', 'NICE-TO-HAVE', 'IMPORTANT', 'CRITICAL']
const activeFeature = ref<ActiveRoadmapCard | null>(null)

function openCard(card: RoadmapCard, sectionTitle: string) {
  activeFeature.value = { card, sectionTitle }
}

function closeCard() {
  activeFeature.value = null
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeCard()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
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
        <button
          v-for="card in section.cards"
          :key="card.title"
          type="button"
          class="roadmap-card"
          @click="openCard(card, section.title)"
        >
          <span class="roadmap-card-title">{{ card.title }}</span>
          <span
            class="roadmap-card-image"
            :class="[`tone-${card.imageTone || 'gray'}`, { completed: card.completed }]"
          >
            <span class="roadmap-card-image-label">{{ card.imageLabel || card.title }}</span>
          </span>
        </button>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="activeFeature"
        class="roadmap-modal-shell"
        role="presentation"
        @click.self="closeCard"
      >
        <article
          class="roadmap-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="roadmap-modal-title"
        >
          <button type="button" class="roadmap-modal-close" aria-label="Close roadmap detail" @click="closeCard">
            ×
          </button>
          <div
            class="roadmap-modal-image"
            :class="[`tone-${activeFeature.card.imageTone || 'gray'}`, { completed: activeFeature.card.completed }]"
          >
            <span class="roadmap-modal-image-label">{{ activeFeature.card.imageLabel || activeFeature.card.title }}</span>
          </div>
          <div class="roadmap-modal-body">
            <p class="roadmap-modal-section">{{ activeFeature.sectionTitle }}</p>
            <h2 id="roadmap-modal-title">{{ activeFeature.card.title }}</h2>
            <div class="roadmap-modal-meta">
              <span class="roadmap-modal-avatar">SO</span>
              <strong>{{ activeFeature.card.author || 'Shared Orbit' }}</strong>
              <span>{{ activeFeature.card.posted || 'Posted on July 2026' }}</span>
            </div>
            <p>{{ activeFeature.card.description }}</p>
          </div>
          <footer class="roadmap-modal-footer">
            <strong>How important is this to you?</strong>
            <div>
              <button v-for="label in importanceLabels" :key="label" type="button">
                {{ label }}
              </button>
            </div>
          </footer>
        </article>
      </div>
    </Teleport>
  </div>
</template>
