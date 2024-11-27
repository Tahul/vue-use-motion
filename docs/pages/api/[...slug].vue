<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'

definePageMeta({ layout: 'docs' })
const route = useRoute()

// Main page data
const { data: page } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne())
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}
const headline = computed(() => findPageHeadline(page.value))

// Surrounding pages (Next & Prev)
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryContent()
    .where({ _extension: 'md', navigation: { $ne: false } })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path)))

// Page Metadata (SEO & OG)
const { setPageMeta } = usePageMeta()
setPageMeta({
  title: page.value.title ?? '',
  description: page.value.description,
  headline: headline.value,
})

// Right Side Links
const { toc } = useAppConfig()
const links = computed(() =>
  [
    toc?.bottom?.edit && {
      icon: 'i-heroicons-pencil-square',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page?.value?._file}`,
      target: '_blank',
    },
  ].filter(Boolean),
)

const UPageHeaderComponent = resolveComponent('UPageHeader')
</script>

<template>
  <UPage>
    <Motion
      :is="UPageHeaderComponent"
      v-bind="$nuxt._appConfig.motions.pageHeader"
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :headline="headline"
    >
      <template #headline>
        <Motion v-bind="$nuxt._appConfig.motions.headers.common">
          {{ headline }}
        </Motion>
      </template>
      <template #title>
        <Motion v-bind="$nuxt._appConfig.motions.headers.h1">
          {{ page.title }}
        </Motion>
      </template>
      <template #description>
        <Motion v-bind="$nuxt._appConfig.motions.headers.h1">
          {{ page.description }}
        </Motion>
      </template>
    </Motion>

    <UPageBody prose>
      <ContentRenderer v-if="page.body" :value="page" />

      <hr v-if="surround?.length">

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template v-if="page.toc !== false" #right>
      <UContentToc :title="toc?.title" :links="page.body?.toc?.links">
        <template v-if="toc?.bottom" #bottom>
          <div
            class="hidden lg:block space-y-6"
            :class="{ '!mt-6': page.body?.toc?.links?.length }"
          >
            <UDivider v-if="page.body?.toc?.links?.length" type="dashed" />
            <UPageLinks :links="links" />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
