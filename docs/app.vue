<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import type { PageLink } from '#ui-pro/types'

// Seo
const { seo } = useAppConfig()
useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/favicon.ico' }],
})
useSeoMeta({
  titleTemplate: `%s - ${seo.siteName}`,
  ogSiteName: seo.siteName,
  twitterCard: 'summary_large_image',
})

// Navigation Data
const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation())
provide('navigation', navigation)

// Search
const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', {
  default: () => [],
  server: false,
})

// Header
const route = useRoute()
const links: PageLink[] = computed(() => [
  {
    label: 'Getting started',
    to: `/getting-started`,
    icon: 'i-heroicons-rocket-launch',
    active: route.path.startsWith('/getting-started'),
  },
  {
    label: 'Features',
    to: `/features/presets`,
    icon: 'i-heroicons-rocket-launch',
    active: route.path.startsWith('/features'),
  },
  {
    label: 'Api',
    to: `/api/use-motion`,
    icon: 'i-heroicons-rocket-launch',
    active: route.path.startsWith('/api'),
  },
])
</script>

<template>
  <div>
    <TheHeader :links="links" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <TheFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation ?? undefined"
        :links="links"
      />
    </ClientOnly>

    <UNotifications />
  </div>
</template>

<style>
body {
  font-family: 'Inter var experimental', 'Inter var', 'Inter', sans-serif;
}
</style>
