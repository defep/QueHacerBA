<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Agenda, City, Event } from '~/types/agenda'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const agenda = ref<Agenda | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedAudience = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(`${apiBase}/api/agenda`)
    if (!response.ok) throw new Error('Failed to fetch agenda')
    agenda.value = await response.json()
  } catch (e) {
    error.value = 'Error cargando la agenda'
    console.error(e)
  } finally {
    loading.value = false
  }
})

const cities = computed<City[]>(() => {
  if (!agenda.value) return []
  
  const cityMap = new Map<string, Event[]>()
  
  for (const event of agenda.value.events) {
    if (!cityMap.has(event.city)) {
      cityMap.set(event.city, [])
    }
    cityMap.get(event.city)!.push(event)
  }
  
  return Array.from(cityMap.entries()).map(([city, events]) => ({
    city,
    events: events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }))
})

const availableAudiences = computed(() => {
  if (!agenda.value) return []
  
  const audiences = new Set<string>()
  agenda.value.events.forEach(event => {
    event.audience.forEach(a => audiences.add(a))
  })
  
  return Array.from(audiences).sort()
})

const filteredCities = computed(() => {
  if (!cities.value) return []
  
  if (!selectedAudience.value) {
    return cities.value
  }
  
  return cities.value
    .map(city => ({
      ...city,
      events: city.events.filter(event => 
        event.audience.includes(selectedAudience.value!)
      )
    }))
    .filter(city => city.events.length > 0)
})

const handleFilter = (audience: string | null) => {
  selectedAudience.value = audience
}
</script>

<template>
  <div class="min-h-screen bg-cream-50">
    <TheHeader v-if="agenda" />
    
    <main class="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-forest/20 border-t-forest rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-stone-600">Cargando agenda...</p>
        </div>
      </div>
      
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="onMounted"
          class="px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-300 transition-colors"
        >
          Reintentar
        </button>
      </div>
      
      <div v-else-if="agenda">
        <div class="mb-8 p-4 bg-white rounded-lg border border-stone-200 shadow-sm">
          <FilterBar 
            :available-audiences="availableAudiences"
            :selected-audience="selectedAudience"
            @filter="handleFilter"
          />
        </div>
        
        <div v-if="filteredCities.length === 0" class="text-center py-12 text-stone-500">
          No se encontraron eventos para el filtro seleccionado
        </div>
        
        <div v-else>
          <CitySection 
            v-for="city in filteredCities" 
            :key="city.city"
            :city="city"
            :events="city.events"
          />
        </div>
      </div>
    </main>
    
    <footer class="bg-stone-100 border-t border-stone-200 py-6 mt-auto">
      <div class="max-w-5xl mx-auto px-4 md:px-6 text-center text-sm text-stone-500">
        <p>© 2026 Puebleando BA - Eventos rurales de Buenos Aires</p>
      </div>
    </footer>
  </div>
</template>
