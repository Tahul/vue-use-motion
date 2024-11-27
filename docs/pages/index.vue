<script setup lang="ts">
const { data: page } = await useAsyncData('index', () =>
  queryContent('/').findOne())

// Page Metadata (SEO & OG)
const { setPageMeta } = usePageMeta()
setPageMeta({
  title: page.value.title,
  description: page.value.description,
  // headline: page.value.hero.headline.label,
})
</script>

<template>
  <div>
    <ULandingHero v-if="page.hero" v-bind="page.hero">
      <template #title>
        <p><span class="text-primary">VueUse</span> <span>Motion</span></p>
      </template>
      <!-- <MDC :value="page.hero.code" tag="pre" class="prose prose-primary dark:prose-invert mx-auto min-w-80" /> -->
      <Person />
    </ULandingHero>

    <ULandingSection :title="page.features.title" :links="page.features.links">
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) of page.features.items"
          :key="index"
          v-bind="item"
        />
      </UPageGrid>
    </ULandingSection>
  </div>
</template>
