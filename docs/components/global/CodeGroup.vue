<script setup lang="ts">
import type { PropType } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined,
  },
})

const config = {
  wrapper: 'relative [&>div:last-child]:!my-0 [&>div:last-child]:!static my-5',
  header: 'flex items-center gap-1 border border-gray-200 dark:border-gray-700 border-b-0 rounded-t-md overflow-hidden p-2',
  tab: {
    base: 'px-2 py-1.5 focus:outline-none text-gray-700 dark:text-gray-200 text-sm rounded-md flex items-center gap-1.5',
    active: 'bg-gray-100 dark:bg-gray-800',
    inactive: 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
    icon: {
      base: '',
    },
  },
}

const slots = useSlots()
const { ui, attrs } = useUI('content.codeGroup', undefined, config, toRef(props, 'class'), true)

const selectedIndex = ref(0)
defineExpose({ selectedIndex })

function transformSlot(slot: any, index: number) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }

  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot,
  }
}

// Computed

const tabs = computed(() => slots.default?.()?.flatMap(transformSlot).filter(Boolean) || [])

const selectedTab = computed(() => tabs.value.find((_, index) => index === selectedIndex.value))
</script>

<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div :class="ui.header">
      <Motion
        is="button"
        v-for="(tab, index) in tabs"
        :key="index"
        tabindex="-1"
        :class="[ui.tab.base, selectedIndex === index ? ui.tab.active : ui.tab.inactive]"
        v-bind="$nuxt._appConfig.motions.codeGroupButton"
        @click="selectedIndex = index"
      >
        <ProseCodeIcon :icon="tab.icon" :filename="tab.label" :class="ui.tab.icon.base" />
        <span>{{ tab.label }}</span>
      </Motion>
    </div>

    <component :is="selectedTab?.component" :key="selectedIndex" hide-header />
  </div>
</template>
