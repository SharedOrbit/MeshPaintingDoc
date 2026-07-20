<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'

type RoadmapCard = {
  title: string
  description: string
  imageTone?: 'blue' | 'orange' | 'green' | 'gray'
  imageLabel?: string
  imageSrc?: string
  completed?: boolean
  author?: string
  posted?: string
}

type ActiveRoadmapCard = {
  card: RoadmapCard
}

const cards: RoadmapCard[] = [
  {
    title: 'Brush Types',
    imageTone: 'blue',
    imageLabel: 'Round / Star / Scatter',
    imageSrc: '/roadmap/brush-types.png',
    posted: 'Forward looking',
    description: 'Optional brush type support so projects can let players paint with different brush masks instead of only the default round brush. The feature can be enabled when a game wants selectable shapes such as round, star, scatter, square, soft, or splash.'
  },
  {
    title: 'Texture Painting',
    imageTone: 'orange',
    imageLabel: 'Texture Brush',
    imageSrc: '/roadmap/texture-painting.png',
    posted: 'Forward looking',
    description: 'Texture painting support so projects can paint with selected texture masks or surface patterns instead of only flat color. This would let players apply details such as metal plates, fabric, dirt, decals, camouflage, or custom brush textures directly onto runtime paint targets.'
  },
  {
    title: 'Feedback Driven Updates',
    imageTone: 'blue',
    imageLabel: 'Feedback Loop',
    imageSrc: '/roadmap/feedback-updates.png',
    posted: 'Forward looking',
    description: 'Ongoing improvements based on user feedback, reported issues, and practical production needs. Confirmed bugs will be prioritized for fixes, while useful workflow suggestions can shape future runtime painting features and documentation updates.'
  },
  {
    title: 'Material Examples',
    imageTone: 'gray',
    imageLabel: 'Material Graph',
    posted: 'Forward looking',
    description: 'Extra material examples for color-only painting, material setting painting, opacity blending, and packed metallic/roughness workflows.'
  },
  {
    title: 'Brush Presets',
    imageTone: 'blue',
    imageLabel: 'Brush Presets',
    posted: 'Forward looking',
    description: 'Reusable brush presets for size, opacity, hardness, material settings, and eraser behavior.'
  },
  {
    title: 'Advanced Multiplayer Notes',
    imageTone: 'green',
    imageLabel: 'Replication Flow',
    posted: 'Forward looking',
    description: 'More examples for listen server, dedicated server, late join replay, and low bandwidth paint command replication.'
  },
  {
    title: 'Packaging Checklist',
    imageTone: 'gray',
    imageLabel: 'Shipping Build',
    posted: 'Forward looking',
    description: 'A focused checklist for plugin content, shader loading, supported platforms, and packaged build validation.'
  },
  {
    title: 'More Brush Shapes',
    imageTone: 'orange',
    imageLabel: 'Brush Masks',
    posted: 'Forward looking',
    description: 'Investigating additional brush masks and falloff styles without changing the current runtime GPU paint path.'
  },
  {
    title: 'Extra Platform Testing',
    imageTone: 'gray',
    imageLabel: 'Platform Testing',
    posted: 'Forward looking',
    description: 'Windows is the current tested target. Other platforms should only be listed after shader, render target, and packaging validation.'
  },
  {
    title: 'Editor Utility Helpers',
    imageTone: 'blue',
    imageLabel: 'Editor Helpers',
    posted: 'Forward looking',
    description: 'Possible optional editor helpers for preparing materials and checking paint target setup before runtime.'
  }
]

const importanceLabels = ['NOT IMPORTANT', 'NICE-TO-HAVE', 'IMPORTANT', 'CRITICAL']
const activeFeature = ref<ActiveRoadmapCard | null>(null)

function openCard(card: RoadmapCard) {
  activeFeature.value = { card }
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
      <a class="active" href="#forward-looking">Forward Looking</a>
    </nav>

    <section id="forward-looking" class="roadmap-section">
      <div class="roadmap-grid">
        <button
          v-for="card in cards"
          :key="card.title"
          type="button"
          class="roadmap-card"
          @click="openCard(card)"
        >
          <span class="roadmap-card-title">{{ card.title }}</span>
          <span
            class="roadmap-card-image"
            :class="[`tone-${card.imageTone || 'gray'}`, { completed: card.completed, 'has-real-image': card.imageSrc }]"
          >
            <img
              v-if="card.imageSrc"
              :src="withBase(card.imageSrc)"
              :alt="card.imageLabel || card.title"
              loading="lazy"
            >
            <span v-else class="roadmap-card-image-label">{{ card.imageLabel || card.title }}</span>
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
            x
          </button>
          <div
            class="roadmap-modal-image"
            :class="[`tone-${activeFeature.card.imageTone || 'gray'}`, { completed: activeFeature.card.completed, 'has-real-image': activeFeature.card.imageSrc }]"
          >
            <img
              v-if="activeFeature.card.imageSrc"
              :src="withBase(activeFeature.card.imageSrc)"
              :alt="activeFeature.card.imageLabel || activeFeature.card.title"
            >
            <span v-else class="roadmap-modal-image-label">{{ activeFeature.card.imageLabel || activeFeature.card.title }}</span>
          </div>
          <div class="roadmap-modal-body">
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
