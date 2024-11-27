import { config, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { MotionComponent, MotionPlugin } from '../src'
import MotionGroup from '../src/components/MotionGroup'
import { intersect } from './utils/intersectionObserver'
import { getTestComponent, useCompletionFn, waitForMockCalls } from './utils'

// Register plugin
config.global.plugins.push([
  MotionPlugin,
  {
    directives: {
      'custom-preset': {
        initial: { scale: 1, y: 50 },
        hovered: { scale: 1.2, y: 0 },
      },
    },
  },
])

describe.each([
  { t: 'directive', name: '`v-motion` directive (shared tests)' },
  { t: 'component', name: '`<Motion>` component (shared tests)' },
])(`$name`, async ({ t }) => {
  const TestComponent = getTestComponent(t)

  it('lifecycle variants', async () => {
    const onComplete = useCompletionFn()

    const wrapper = mount(TestComponent, {
      props: {
        initial: { opacity: 0, x: -100 },
        enter: { opacity: 1, x: 0, transition: { onComplete } },
        duration: 10,
      },
    })

    const el = wrapper.element as HTMLDivElement
    await nextTick()

    // Renders initial variant
    expect(el.style.opacity).toEqual('0')
    expect(el.style.transform).toEqual('translate3d(-100px,0px,0px)')

    await waitForMockCalls(onComplete)

    // Renders enter variant
    expect(el.style.opacity).toEqual('1')
    expect(el.style.transform).toEqual('translateZ(0px)')
  })

  it('visibility variants', async () => {
    const onComplete = useCompletionFn()

    const wrapper = mount(TestComponent, {
      props: {
        initial: { color: 'red', y: 100, transition: { onComplete } },
        visible: { color: 'green', y: 0, transition: { onComplete } },
        duration: 10,
      },
    })

    const el = wrapper.element as HTMLDivElement
    await nextTick()

    expect(el.style.color).toEqual('red')
    expect(el.style.transform).toEqual('translate3d(0px,100px,0px)')

    // Trigger mock intersection
    intersect(el, true)
    await waitForMockCalls(onComplete)

    expect(el.style.color).toEqual('green')
    expect(el.style.transform).toEqual('translateZ(0px)')

    // Trigger mock intersection
    intersect(el, false)
    await waitForMockCalls(onComplete)

    expect(el.style.color).toEqual('red')
    expect(el.style.transform).toEqual('translate3d(0px,100px,0px)')
  })

  it('event variants', async () => {
    const onComplete = useCompletionFn()

    const wrapper = mount(TestComponent, {
      props: {
        initial: { scale: 1, transition: { onComplete } },
        hovered: { scale: 1.2, transition: { onComplete } },
        tapped: { scale: 1.5, transition: { onComplete } },
        focused: { scale: 2, transition: { onComplete } },
        duration: 10,
      },
    })

    const el = wrapper.element as HTMLDivElement
    await nextTick()

    // Renders initial
    expect(el.style.transform).toEqual('scale(1) translateZ(0px)')

    // Trigger hovered
    await wrapper.trigger('mouseenter')
    await waitForMockCalls(onComplete)

    expect(el.style.transform).toEqual('scale(1.2) translateZ(0px)')

    // Trigger tapped
    await wrapper.trigger('mousedown')
    await waitForMockCalls(onComplete)

    expect(el.style.transform).toEqual('scale(1.5) translateZ(0px)')

    // Trigger focus
    await wrapper.trigger('focus')
    await waitForMockCalls(onComplete)

    expect(el.style.transform).toEqual('scale(2) translateZ(0px)')

    // Should return to tapped
    await wrapper.trigger('blur')
    await waitForMockCalls(onComplete)

    expect(el.style.transform).toEqual('scale(1.5) translateZ(0px)')

    // Should return to hovered
    await wrapper.trigger('mouseup')
    await waitForMockCalls(onComplete)

    expect(el.style.transform).toEqual('scale(1.2) translateZ(0px)')

    // Should do nothing on 'mouseout'
    await wrapper.trigger('mouseout')
    // TODO: figure out a better way to test if a variant is not triggered than timeouts
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await waitForMockCalls(onComplete, 0)

    // Should return to initial, 'mouseleave' triggers when pointer left element and all descendants
    await wrapper.trigger('mouseleave')
    await waitForMockCalls(onComplete, 1)

    expect(el.style.transform).toEqual('scale(1) translateZ(0px)')
  })
})

describe('`<Motion>` component', async () => {
  it('uses and merges custom presets', async () => {
    const wrapper = mount(
      { render: () => h(MotionComponent) },
      {
        props: {
          preset: 'custom-preset',
          hovered: { y: 100 },
          duration: 10,
        },
      },
    )

    const el = wrapper.element as HTMLDivElement
    await nextTick()

    // Renders initial
    expect(el.style.transform).toMatchInlineSnapshot(`"translate3d(0px,50px,0px) scale(1)"`)

    // Trigger hovered
    await wrapper.trigger('mouseenter')
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    // `custom-preset` sets scale: 1.2 and `hovered` prop sets y: 100
    expect(el.style.transform).toMatchInlineSnapshot(`"translate3d(0px,100px,0px) scale(1.2)"`)
  })

  it('#202 - preserve variant style on rerender', async () => {
    const counter = ref(0)

    const wrapper = mount(
      { render: () => h(MotionComponent, null, () => counter.value) },
      {
        props: {
          initial: { scale: 1 },
          enter: { scale: 2 },
          duration: 10,
        },
      },
    )

    const el = wrapper.element as HTMLDivElement
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    // Renders enter
    expect(el.style.transform).toEqual('scale(2) translateZ(0px)')

    // Trigger rerender by updating slot variable
    counter.value++
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    // Variant style is preserved after rerender/update
    expect(el.style.transform).toEqual('scale(2) translateZ(0px)')
  })
})

describe('`<MotionGroup>` component', async () => {
  it('child node can overwrite helpers', async () => {
    const wrapper = mount({
      render: () =>
        h(
          MotionGroup,
          {
            initial: { opacity: 0 },
            enter: {
              opacity: 0.5,
              transition: { ease: 'linear', delay: 100000 },
            },
          },
          [
            h('div', { id: 1, key: 1, delay: 0 }),
            h('div', { id: 2, key: 2 }),
            h('div', { id: 3, key: 3 }),
          ],
        ),
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    // First div should have finished `enter` variant
    expect(
      (wrapper.find('div#1').element as HTMLDivElement).style?.opacity,
    ).toEqual('0.5')

    // Second div should not have started yet
    expect(
      (wrapper.find('div#2').element as HTMLDivElement).style?.opacity,
    ).toEqual('0')
  })
})
