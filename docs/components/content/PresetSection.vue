<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { useMotion } from '@vueuse/motion'
import defu from 'defu'
import { slugify } from '../../../src/utils/slugify'
import Face from './Face.vue'

const props = defineProps({
  name: {
    type: String as PropType<any>,
  },
  preset: {
    type: Object as PropType<any>,
  },
})

const isReplaying = ref(false)
const replayButton = ref<SVGElement>()
const demoElement = ref<HTMLElement>()

const tweaks: Record<'delay' | 'duration', number> = {
  duration: 600,
  delay: 0,
}

const configWithDuration = computed(() => {
  const config = defu({}, structuredClone(props.preset || {}))

  for (const transitionKey of ['delay', 'duration'] as const) {
    if (!tweaks[transitionKey])
      continue

    const transitionValueParsed = tweaks[transitionKey]

    // TODO: extract to utility function
    // Apply transition property to existing variants where applicable
    for (const variantKey of ['enter', 'visible', 'visibleOnce'] as const) {
      const variantConfig = config[variantKey]

      if (variantConfig == null)
        continue

      variantConfig.transition ??= {}
      variantConfig.transition[transitionKey] = transitionValueParsed
    }
  }

  return config
})

const { apply, set } = useMotion(demoElement, {
  ...configWithDuration.value,
})

const replayInstance = useMotion(replayButton, {
  ...useAppConfig().motions.codeGroupButton,
  initial: {
    ...(useAppConfig().motions.codeGroupButton?.initial ?? {}),
    rotate: 0,
  },
})

async function replay() {
  isReplaying.value = true

  replayInstance.set({
    rotate: 0,
  })
  replayInstance.apply({
    rotate: -180,
  })

  if (props.preset.initial) {
    await set(props.preset.initial)
  }

  if (props.preset.visible)
    await apply(props.preset.visible)

  if (props.preset.visibleOnce)
    await apply(props.preset.visibleOnce)

  if (props.preset.enter)
    await apply(props.preset.enter)

  isReplaying.value = false
}

const { data } = await useAsyncData(`preset-${props.name}`, () =>
  parseMarkdown(
    [
      `::code-group`,
      ...[
        '```vue [<Motion />]',
        // '<template>',
        `<Motion preset="${props.name}" :duration="600" />`,
        // '</template>',
        '```',
      ],
      ...[
        '```vue [v-motion]',
        // '<template>',
        `<div v-motion-${slugify(props.name)} :duration="600" />`,
        // '</template>',
        '```',
      ],
      ...[
        '```json [Preset]',
        `${JSON.stringify(props.preset, null, 2)}`,
        '```',
      ],
      `::`,
    ].join('\n'),
  ))
</script>

<template>
  <Motion class="presetSection" v-bind="$nuxt._appConfig.motions.presetSection">
    <ProseH3 :id="name" class="capitalize">
      {{ name.replace(/[A-Z]/g, (s: any) => ` ${s}`) }}
    </ProseH3>

    <div class="content">
      <ContentRendererMarkdown class="demoCode" :value="data ?? {}" />

      <div class="demoContainer relative" @click="replay">
        <client-only>
          <button class="absolute right-4 top-4">
            <div ref="replayButton" class="replayButton">
              <Icon name="heroicons-outline:refresh" class="h-6 w-6" />
            </div>
          </button>
          <div ref="demoElement" class="demoElement">
            <Face v-once />
          </div>
        </client-only>
      </div>
    </div>
  </Motion>
</template>

<style scoped>
.presetSection {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  gap: 1em;
  align-items: center;
}

.demoCode {
  flex: 2;
  width: 50%;
  height: 100%;
}

.demoContainer {
  border: 1px solid #282828;
  width: 50%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 12rem;
  overflow: hidden;
  border-radius: 16px;
}

.replayButton {
  display: flex;
  align-items: center;
  justify-content: center;
}

.demoElement {
  width: 6rem;
}

.relative {
  position: relative;
}

.capitalize {
  text-transform: capitalize;
}

.absolute {
  position: absolute;
}

.top-4 {
  top: 1rem;
}

.right-4 {
  right: 1rem;
}

.h-6 {
  height: 1.5rem;
}

.w-6 {
  width: 1.5rem;
}
</style>
