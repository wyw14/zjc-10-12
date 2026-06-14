<template>
  <div class="card">
    <span class="date-label">📅 {{ formatDate(data.date) }}</span>

    <div v-if="data.answered" class="status-badge status-answered">
      ✓ 今日已回答
    </div>
    <div v-else class="status-badge status-unanswered">
      ⏰ 等待你的回答
    </div>

    <div class="question-header">
      <div class="question-text">
        {{ data.question.question }}
      </div>
      <button
        class="followup-toggle-btn"
        @click="showFollowUps = !showFollowUps"
        :class="{ active: showFollowUps }"
      >
        <span class="followup-icon">💡</span>
        <span class="followup-text">深度追问</span>
        <span class="followup-arrow">{{ showFollowUps ? '▲' : '▼' }}</span>
      </button>
    </div>

    <transition name="slide">
      <div v-if="showFollowUps && data.followUps && data.followUps.length > 0" class="followups-container">
        <div class="followups-title">🔍 选择一个追问来深入思考：</div>
        <div class="followup-list">
          <button
            v-for="(followUp, index) in data.followUps"
            :key="index"
            class="followup-item"
            @click="insertFollowUp(followUp)"
          >
            <span class="followup-num">{{ index + 1 }}</span>
            <span class="followup-content">{{ followUp }}</span>
            <span class="followup-insert-btn">+ 添加</span>
          </button>
        </div>
      </div>
    </transition>

    <label class="answer-label">✍️ 我的回答：</label>

    <textarea
      ref="answerTextarea"
      v-model="localAnswer"
      class="answer-textarea"
      placeholder="在这里写下你的思考和答案..."
      :disabled="submitting"
    ></textarea>

    <button
      class="submit-btn"
      :disabled="submitting || !localAnswer.trim()"
      @click="handleSubmit"
    >
      {{ submitting ? '保存中...' : '💾 保存回答' }}
    </button>

    <div v-if="data.answered && data.answer" class="displayed-answer">
      <h4>📝 已保存的回答：</h4>
      <p>{{ data.answer }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  todayData: Object,
  submitting: Boolean
})

const emit = defineEmits(['submit'])

const data = ref(props.todayData)
const localAnswer = ref('')
const showFollowUps = ref(false)
const answerTextarea = ref(null)

watch(() => props.todayData, (newVal) => {
  if (newVal) {
    data.value = newVal
    localAnswer.value = newVal.answer || ''
  }
}, { immediate: true })

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`
}

function insertFollowUp(followUp) {
  const textarea = answerTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = localAnswer.value

  const prefix = text.substring(0, start)
  const suffix = text.substring(end)

  const insertion = (prefix && !prefix.endsWith('\n') ? '\n\n' : '') + '追问：' + followUp + '\n'
  localAnswer.value = prefix + insertion + suffix

  const newCursorPos = prefix.length + insertion.length
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  }, 0)
}

function handleSubmit() {
  emit('submit', localAnswer.value)
}
</script>
