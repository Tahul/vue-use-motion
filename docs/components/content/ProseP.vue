<template>
  <Motion
    is="p"
    v-bind="$nuxt._appConfig.motions.common"
  >
    <slot />
  </Motion>
</template>
