<template>
  <Motion
    is="h5"
    v-bind="$nuxt._appConfig.motions.headers.common"
  >
    <slot />
  </Motion>
</template>
