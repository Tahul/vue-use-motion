<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

// Get navigation tree relative to the '/content'
const navigation = inject<Ref<NavItem[]>>('navigation')
const { navPageFromPath } = useContentHelpers()
const route = useRoute()

// console.log('/' + route.path.split('/').at(0))

const allNavigationTree = computed(() =>
  mapContentNavigation(navPageFromPath(`/${route.path.split('/').at(1)}`, navigation?.value || [])?.children || []),
)
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside>
          <UDivider type="dashed" class="mb-6" />
          <UNavigationTree :links="allNavigationTree" default-open :multiple="false" />
        </UAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
