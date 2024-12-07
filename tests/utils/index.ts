import { type Mock, vi } from 'vitest'
import { h } from 'vue'
import { MotionComponent } from '../../src/components'

export function useCompletionFn() {
  return vi.fn(() => {})
}

// Get component using either `v-motion` directive or `<Motion>` component
export function getTestComponent(t: string) {
  if (t === 'directive') {
    return { template: `<div v-motion>Hello world</div>` }
  }

  return { render: () => h(MotionComponent) }
}

// Waits until mock has been called and resets the call count
export async function waitForMockCalls(fn: Mock, calls = 1, options: Parameters<typeof vi.waitUntil>['1'] = { interval: 10 }) {
  try {
    await vi.waitUntil(() => fn.mock.calls.length === calls, options)
    fn.mockReset()
  }
  catch (err) {
    // This ensures the vitest error log shows where this helper is called instead of the helper internals
    if (err instanceof Error) {
      err.message += ` Waited for ${calls} call(s) but failed at ${fn.mock.calls.length} call(s).`

      const arr = err.stack?.split('\n')
      arr?.splice(0, 3)
      err.stack = arr?.join('\n') ?? undefined
    }
    throw err
  }
}

export function getTestComponentSVG(t: string) {
  if (t === 'directive') {
    return {
      template: `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="500"
  height="500"
  viewBox="0 0 24 24"
>
  <line
    stroke="yellow"
    :x1="10"
    :x2="16"
    :y1="22"
    :y2="6"
  />
</svg>
`,
    }
  }
  return {
    render: () => h(MotionComponent, {
      is: 'svg',
    }),
  }
}
