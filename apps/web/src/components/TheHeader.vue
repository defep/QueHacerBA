<script setup lang="ts">
import { MapPin, TreePine } from 'lucide-vue-next'
</script>

<template>
  <header class="bg-gradient-to-b from-cream-50 to-white border-b border-stone-200 py-8 md:py-12">
    <div class="max-w-5xl mx-auto px-4 md:px-6">
      <div class="flex items-center justify-center gap-3 mb-4">
        <TreePine class="w-8 h-8 text-forest" />
        <span class="text-forest font-semibold tracking-wide uppercase text-sm">
          Puebleando BA
        </span>
      </div>

      <div class="text-center">
        <h1 class="font-serif text-3xl md:text-4xl font-bold text-stone-800 text-center mb-3">
          🏡 Escapadas de Fin de Semana
        </h1>
        <p class="text-stone-500 text-sm md:text-base max-w-xl mx-auto">
          Descubrí los mejores eventos y fiestas populares en los pueblos de Buenos Aires
        </p>
        <div class="flex items-center justify-center gap-2 mt-4 text-forest">
          <MapPin class="w-4 h-4" />
          <span class="text-sm font-medium">Provincia de Buenos Aires</span>
        </div>
      </div>
    </div>
  </header>
</template>
