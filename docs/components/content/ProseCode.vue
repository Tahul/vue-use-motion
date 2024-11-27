<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  code: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: undefined,
  },
  language: {
    type: String,
    default: undefined,
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  filename: {
    type: String,
    default: undefined,
  },
  highlights: {
    type: Array as PropType<number[]>,
    default: undefined,
  },
  meta: {
    type: String,
    default: undefined,
  },
})

const config = {
  wrapper: '[&>pre]:!rounded-t-none [&>pre]:!my-0 my-5',
  header: 'flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 border-b-0 relative rounded-t-md px-4 py-3 not-prose',
  icon: {
    base: '',
  },
  button: {
    base: 'absolute top-2.5 right-2.5',
  },
  filename: 'text-gray-700 dark:text-gray-200 text-sm/6',
}

const { ui } = useUI('content.prose.code', undefined, config, undefined, true)
</script>

<template>
  <Motion
    v-bind="$nuxt._appConfig.motions.code"
    style="transform-origin: top;"
    class="relative prose-code" :class="!!filename && ui.wrapper"
  >
    <div v-if="filename && !hideHeader" :class="ui.header">
      <ProseCodeIcon :icon="icon" :filename="filename" :class="ui.icon.base" />

      <span :class="ui.filename">{{ filename }}</span>
    </div>

    <ProseCodeButton :code="code" :class="ui.button.base" />

    <slot />
  </Motion>
</template>

<style scoped>
.prose-code pre {
  margin-top: 0;
  margin-bottom: 0;
}
pre code .line {
  display: block;
  min-height: 1rem;

}
</style>
