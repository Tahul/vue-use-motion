<script setup lang="ts">
import Delay from './demos/Delay.vue'
import Editor from './demos/Editor.vue'
import Transitions from './demos/Transitions.vue'
import Sandbox from './demos/Sandbox.vue'
import SVGPath from './demos/SVGPath.vue'

const sandbox = false
</script>

<template>
  <div>
    <div class="flex items-center justify-center">
      <h1 class="m-6 cursor-pointer select-none text-4xl font-bold">
        🤹&nbsp;@vueuse/motion
      </h1>
    </div>

    <template v-if="!sandbox">
      <h1 class="flex items-center justify-center text-3xl font-bold">
        Delay
      </h1>

      <Delay class="mt-6 mb-6" />

      <h1 class="flex items-center justify-center text-3xl font-bold">
        Editor
      </h1>

      <Editor class="mt-6 mb-6" />

      <h1 class="flex items-center justify-center text-3xl font-bold">
        Transitions
      </h1>

      <Transitions class="mt-6 mb-6" />

      <h1 class="flex items-center justify-center text-3xl font-bold">
        SVGPath
      </h1>

      <SVGPath class="mt-6 mb-6" />
    </template>

    <Sandbox v-else />

    <div class="flex flex-col items-center justify-center">
      <a class="mt-12 mb-6" href="https://github.com/vueuse/motion"> ↩️&nbsp;&nbsp;Bring me back to GitHub </a>

      <p class="mb-6 text-center">
        This package has been written by
        <a href="https://twitter.com/yaeeelglx" target="_blank"> Yaël Guilloux </a>
      </p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply font-bold transition-colors duration-100 hover:text-blue-400;
}
</style>
