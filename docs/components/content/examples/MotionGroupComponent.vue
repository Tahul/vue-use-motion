<script lang="ts" setup></script>

<template>
  <div class="example-wrapper">
    <div class="example-hint">
      Scroll down to trigger motion!
    </div>
    <MotionGroup preset="slideVisibleLeft" :duration="600">
      <section>
        <h3 class="text-sm">
          Product 1
        </h3>
        <p class="text-xs">
          Description text
        </p>
      </section>
      <section>
        <h3 class="text-sm">
          Product 2
        </h3>
        <p class="text-xs">
          Description text
        </p>
      </section>
      <section>
        <h3 class="text-sm">
          Product 3
        </h3>
        <p class="text-xs">
          Description text
        </p>
      </section>
    </MotionGroup>
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
p,
section {
  display: flex;
  flex-direction: column;

  flex: 1 0;
  align-items: center;
  justify-content: center;

  height: 100%;
  padding: 2em;
}

section {
  background-color: #111;
  height: calc(100% / 3);
}

section h3,
section p {
  margin: 0.5em !important;
  padding: 0 !important;
}
</style>
