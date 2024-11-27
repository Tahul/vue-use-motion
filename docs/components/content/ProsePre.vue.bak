<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <Motion
    is="pre"
    v-bind="$nuxt._appConfig.motions.pre"
    :class="$props.class"
  >
    <slot />
  </Motion>
</template>

<style>
pre code .line {
  display: block;
}
</style>
