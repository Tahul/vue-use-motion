<template>
  <Motion
    is="h1"
    v-bind="$nuxt._appConfig.motions.headers.h1"
  >
    <slot />
  </Motion>
</template>
