<script lang="ts" setup></script>

<template>
  <div class="example-wrapper">
    <div class="example-hint">
      Scroll down to trigger motion!
    </div>
    <Motion is="p" preset="slideVisibleLeft">
      <div class="example-target">
        Text in Motion!
      </div>
    </Motion>
  </div>
</template>

<style scoped>
.example-wrapper {
  height: 200px;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: center;
  border: 1px solid #282828;
  border-radius: 0.5em;
}

.example-hint,
p {
  display: flex;
  flex: 1 0;

  align-items: center;
  justify-content: center;

  height: 100%;
  padding: 2em;
}

.example-target {
  padding: 1em;
  background-color: #111;
  border-radius: 0.5em;
}
</style>
