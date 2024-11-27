<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String as PropType<
      | '_blank'
      | '_parent'
      | '_self'
      | '_top'
      | (string & object)
      | null
      | undefined
    >,
    default: undefined,
    required: false,
  },
})
</script>

<template>
  <Motion
    is="span"
    v-bind="$nuxt._appConfig.motions.a"
    style="display: inline-block"
  >
    <NuxtLink :href="href" :target="target">
      <slot />
    </NuxtLink>
  </Motion>
</template>
