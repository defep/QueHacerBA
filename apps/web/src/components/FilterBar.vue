<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  availableAudiences: string[]
  selectedAudience: string | null
}>()

const emit = defineEmits<{
  (e: 'filter', audience: string | null): void
}>()

const audienceLabels: Record<string, string> = {
  'familias': 'Familias',
  'niños': 'Niños',
  'jóvenes': 'Jóvenes',
  'adultos': 'Adultos',
  'turistas': 'Turistas',
  'nostálgicos años 80': 'Años 80',
  'amantes historia medieval': 'Historia Medieval',
}

const getLabel = (audience: string) => {
  return audienceLabels[audience] || audience
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="text-sm text-stone-600 mr-2">Filtrar por:</span>
    
    <button
      @click="emit('filter', null)"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
        selectedAudience === null
          ? 'bg-forest text-white shadow-md'
          : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
      ]"
    >
      Todos
    </button>
    
    <button
      v-for="audience in availableAudiences"
      :key="audience"
      @click="emit('filter', audience)"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5',
        selectedAudience === audience
          ? 'bg-forest text-white shadow-md'
          : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
      ]"
    >
      {{ getLabel(audience) }}
      
      <X 
        v-if="selectedAudience === audience" 
        class="w-3.5 h-3.5" 
      />
    </button>
  </div>
</template>
