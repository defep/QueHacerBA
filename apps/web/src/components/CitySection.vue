<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import type { City, Event } from '~/types/agenda'

const props = defineProps<{
  city: City
  events: Event[]
}>()
</script>

<template>
  <section class="mb-12">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-2xl">📍</span>
      <h2 class="font-serif text-3xl font-bold text-stone-800">
        {{ city.city }}
      </h2>
      <span class="text-sm text-stone-500 font-normal ml-2">
        ({{ events.length }} evento{{ events.length !== 1 ? 's' : '' }})
      </span>
    </div>
    
    <div class="w-full h-px bg-gradient-to-r from-forest/30 via-forest/10 to-transparent mb-8"></div>
    
    <div v-if="events.length === 0" class="text-stone-500 italic py-8 text-center">
      No hay eventos para esta ciudad
    </div>
    
    <div v-else class="grid gap-6 md:grid-cols-2">
      <EventCard 
        v-for="(event, index) in events" 
        :key="index"
        :event="event"
      />
    </div>
  </section>
</template>
