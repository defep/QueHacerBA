<script setup lang="ts">
import { computed, ref } from 'vue'
import { Clock, MapPin, Users, DollarSign, Heart } from 'lucide-vue-next'
import type { Event } from '~/types/agenda'

const props = defineProps<{
  event: Event
}>()

const isLiked = ref(false)

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
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

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const audienceLabels: Record<string, string> = {
  familias: 'Familias',
  jovenes: 'Jóvenes',
  adultos: 'Adultos',
  turistas: 'Turistas'
}
</script>

<template>
  <div class="relative bg-white rounded-xl border border-stone-200 shadow-sm hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <span v-if="event.is_free" class="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full z-10">
      Gratis
    </span>
    
    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-3 pr-12">
        <h3 class="font-semibold text-stone-800 text-lg leading-tight group-hover:text-forest transition-colors">
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
            event.is_free ? 'bg-green-50 text-forest' : 'bg-stone-100 text-stone-600'
          ]"
        >
          <DollarSign class="w-3.5 h-3.5" />
          {{ costText }}
        </span>
      </div>
      
      <p class="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3">
        {{ event.description }}
      </p>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="aud in event.audience" 
          :key="aud"
          class="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
        >
          {{ audienceLabels[aud] || aud }}
        </span>
      </div>
      
      <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
        <p class="text-xs text-stone-400">
          Fuente: {{ sourceText }}
        </p>
        
        <button 
          @click="toggleLike"
          class="flex items-center gap-1.5 text-sm font-medium transition-colors"
          :class="isLiked ? 'text-red-500' : 'text-stone-400 hover:text-red-500'"
        >
          <Heart class="w-5 h-5" :class="{ 'fill-current': isLiked }" />
          <span class="hidden sm:inline">{{ isLiked ? 'Me interesa' : 'Me interesa' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
