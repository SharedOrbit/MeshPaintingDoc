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
  }
]

const importanceLabels = ['NOT IMPORTANT', 'NICE-TO-HAVE', 'IMPORTANT', 'CRITICAL']
const activeFeature = ref<ActiveRoadmapCard | null>(null)
const selectedImportance = ref('')
const feedbackMessage = ref('')
const feedbackContact = ref('')
const feedbackStatus = ref<'idle' | 'success' | 'error'>('idle')
const feedbackStatusMessage = ref('')
const isSubmittingFeedback = ref(false)
const feedbackEndpoint = 'https://script.google.com/macros/s/AKfycbxvP0IHYQYR42OBfVzPTcmLgKiGK--pMppcOUwpuNvgRj1COvmC0A-xDs9dy4mF0qx2/exec'

function resetFeedbackForm() {
  selectedImportance.value = ''
  feedbackMessage.value = ''
  feedbackContact.value = ''
  feedbackStatus.value = 'idle'
  feedbackStatusMessage.value = ''
  isSubmittingFeedback.value = false
}

function openCard(card: RoadmapCard) {
  activeFeature.value = { card }
  resetFeedbackForm()
}

function closeCard() {
  activeFeature.value = null
  resetFeedbackForm()
}

function selectImportance(label: string) {
  selectedImportance.value = label
  feedbackStatus.value = 'idle'
  feedbackStatusMessage.value = ''
}

async function submitFeedback() {
  if (!activeFeature.value || !selectedImportance.value || !feedbackMessage.value.trim()) {
    return
  }

  isSubmittingFeedback.value = true
  feedbackStatus.value = 'idle'
  feedbackStatusMessage.value = ''

  try {
    await fetch(feedbackEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        feature: activeFeature.value.card.title,
        importance: selectedImportance.value,
        message: feedbackMessage.value.trim(),
        contact: feedbackContact.value.trim(),
        page: typeof window !== 'undefined' ? window.location.href : '/roadmap'
      })
    })

    feedbackMessage.value = ''
    feedbackContact.value = ''
    feedbackStatus.value = 'success'
    feedbackStatusMessage.value = 'Feedback sent.'
  } catch {
    feedbackStatus.value = 'error'
    feedbackStatusMessage.value = 'Feedback could not be sent.'
  } finally {
    isSubmittingFeedback.value = false
  }
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
            <div class="roadmap-feedback-buttons">
              <button
                v-for="label in importanceLabels"
                :key="label"
                type="button"
                :class="{ active: selectedImportance === label }"
                @click="selectImportance(label)"
              >
                {{ label }}
              </button>
            </div>
            <form v-if="selectedImportance" class="roadmap-feedback-form" @submit.prevent="submitFeedback">
              <label for="roadmap-feedback-message">
                Feedback for {{ selectedImportance }}
              </label>
              <textarea
                id="roadmap-feedback-message"
                v-model="feedbackMessage"
                maxlength="1500"
                rows="4"
                placeholder="Tell us what should be improved or why this matters."
              />
              <input
                v-model="feedbackContact"
                maxlength="120"
                placeholder="Discord or email (optional)"
                type="text"
              >
              <div class="roadmap-feedback-actions">
                <span
                  class="roadmap-feedback-status"
                  :class="{ success: feedbackStatus === 'success', error: feedbackStatus === 'error' }"
                >
                  {{ feedbackStatusMessage }}
                </span>
                <button
                  class="roadmap-feedback-submit"
                  type="submit"
                  :disabled="isSubmittingFeedback || !feedbackMessage.trim()"
                >
                  {{ isSubmittingFeedback ? 'SENDING' : 'SEND FEEDBACK' }}
                </button>
              </div>
            </form>
          </footer>
        </article>
      </div>
    </Teleport>
  </div>
</template>
