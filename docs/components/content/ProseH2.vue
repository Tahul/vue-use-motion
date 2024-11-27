<template>
  <Motion
    is="h2"
    v-bind="$nuxt._appConfig.motions.headers.common"
  >
    <slot />
  </Motion>
</template>
