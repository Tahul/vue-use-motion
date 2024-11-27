<template>
  <Motion
    is="h4"
    v-bind="$nuxt._appConfig.motions.headers.common"
  >
    <slot />
  </Motion>
</template>
