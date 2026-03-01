<script setup lang="ts">
import { CalendarDays, TreePine } from 'lucide-vue-next'

defineProps<{
  date: string
}>()
</script>

<template>
  <header class="bg-cream-50 border-b border-stone-200 py-8 md:py-12">
    <div class="max-w-5xl mx-auto px-4 md:px-6">
      <div class="flex items-center justify-center gap-3 mb-4">
        <TreePine class="w-8 h-8 text-forest" />
        <span class="text-forest font-semibold tracking-wide uppercase text-sm">
          Puebleando BA
        </span>
      </div>

      <div class="flex items-center justify-center gap-3 text-stone-600">
        <CalendarDays class="w-6 h-6" />
        <h1 class="font-serif text-2xl md:text-3xl font-bold text-stone-800 text-center">
          {{ date }}
        </h1>
      </div>
    </div>
  </header>
</template>
