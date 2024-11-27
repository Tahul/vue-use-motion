<template>
  <Motion
    is="h3"
    v-bind="$nuxt._appConfig.motions.headers.common"
  >
    <slot />
  </Motion>
</template>
