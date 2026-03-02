<script setup lang="ts">
import { computed } from 'vue'
import { Clock, MapPin, Users, DollarSign } from 'lucide-vue-next'
import type { Event } from '~/types/agenda'

const props = defineProps<{
  event: Event
}>()

const formatAudience = (audience: string[]) => {
  return audience.join(', ')
}

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
}

const formatTime = (time: string | null) => {
  return time ? time : 'sin horario'
}

const costText = computed(() => {
  if (props.event.is_free === true) return 'Gratis'
  if (props.event.price_text) return props.event.price_text
  return 'Consultar'
})

const sourceText = computed(() => {
  return props.event.sources?.[0]?.entity || 'Fuente no disponible'
})
</script>

<template>
  <div class="bg-white rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-3">
        <h3 class="font-semibold text-stone-800 text-lg leading-tight">
          {{ event.name }}
        </h3>
      </div>
      
      <div class="flex items-center gap-2 text-stone-500 text-sm mb-4">
        <MapPin class="w-4 h-4 text-earth shrink-0" />
        <span class="truncate">{{ event.venue || event.address }}</span>
      </div>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700"
        >
          <Clock class="w-3.5 h-3.5" />
          {{ formatDate(event.date) }} · {{ formatTime(event.start_time) }}
        </span>
        
        <span 
          :class="[
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
            event.is_free ? 'bg-green-50 text-forest' : 'bg-earth/10 text-earth'
          ]"
        >
          <DollarSign class="w-3.5 h-3.5" />
          {{ costText }}
        </span>
        
        <span 
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700"
        >
          <Users class="w-3.5 h-3.5" />
          {{ formatAudience(event.audience) }}
        </span>
      </div>
      
      <p class="text-stone-600 text-sm leading-relaxed mb-4">
        {{ event.description }}
      </p>
      
      <div class="pt-3 border-t border-stone-100">
        <p class="text-xs text-stone-400">
          Fuente: {{ sourceText }}
        </p>
      </div>
    </div>
  </div>
</template>
