import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useElementStyle } from '../src'

const TestComponent = {
  template: '<div>Hello world</div>',
}

function getElementRef() {
  const c = mount(TestComponent)

  return ref<HTMLElement>(c.element as HTMLElement)
}

describe('useElementStyle', () => {
  it('accepts an element', () => {
    const element = getElementRef()

    const { style } = useElementStyle(element)

    expect(style).toBeDefined()
  })

  it('mutates style properties', () => {
    const element = getElementRef()

    const { style } = useElementStyle(element)

    style.backgroundColor = 'blue'

    expect(style.backgroundColor).toBe('blue')
  })

  it('mutates element properties', async () => {
    const element = getElementRef()

    const { style } = useElementStyle(element)

    style.backgroundColor = 'blue'

    await nextTick()

    expect(element.value.style.backgroundColor).toBe('blue')
  })
})

/**
 * tests for svg path
 * pathLegnth
 * pathSpacing
 * pathOffset
 */
const TestComponentSVG = {
  template: `<svg
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

function getSVGElementRef() {
  const c = mount(TestComponentSVG)

  return ref<SVGElement>(c.element as SVGElement)
}

describe('useElementStyle Test SVGPath', () => {
  it('accepts an svg element', () => {
    const element = getSVGElementRef()

    const { style } = useElementStyle(element)

    expect(style).toBeDefined()
  })

  it('mutates pathLength', async () => {
    const element = getSVGElementRef()
    const { style } = useElementStyle(element)
    style.pathLength = 2

    const line = element.value.querySelector('line')
    const { style: lineStyle } = useElementStyle(line)
    lineStyle.pathLength = 3

    await nextTick()

    // svg
    expect(element.value.getAttribute('pathLength')).toBe('1')
    expect(element.value.getAttribute('stroke-dashoffset')).toBe('0')
    expect(element.value.getAttribute('stroke-dasharray')).toBe('2 1')

    // line
    expect(line.getAttribute('pathLength')).toBe('1')
    expect(line.getAttribute('stroke-dashoffset')).toBe('0')
    expect(line.getAttribute('stroke-dasharray')).toBe('3 1')

    // number
    lineStyle.pathLength = 3
    lineStyle.pathOffset = 3
    lineStyle.pathSpacing = 3

    await nextTick()

    expect(line.getAttribute('pathLength')).toBe('1')
    expect(line.getAttribute('stroke-dashoffset')).toBe('3')
    expect(line.getAttribute('stroke-dasharray')).toBe('3 3')

    // string
    lineStyle.pathLength = '3'
    lineStyle.pathOffset = '3'
    lineStyle.pathSpacing = '2'

    await nextTick()

    expect(line.getAttribute('pathLength')).toBe('1')
    expect(line.getAttribute('stroke-dashoffset')).toBe('3')
    expect(line.getAttribute('stroke-dasharray')).toBe('3 2')

    // px
    lineStyle.pathLength = '3px'
    lineStyle.pathOffset = '3px'
    lineStyle.pathSpacing = '2px'

    await nextTick()

    expect(line.getAttribute('pathLength')).toBe('1')
    expect(line.getAttribute('stroke-dashoffset')).toBe('3px')
    expect(line.getAttribute('stroke-dasharray')).toBe('3px 2px')

    // percentage
    lineStyle.pathLength = '3%'
    lineStyle.pathOffset = '3%'
    lineStyle.pathSpacing = '2%'

    await nextTick()

    expect(line.getAttribute('pathLength')).toBe('1')
    expect(line.getAttribute('stroke-dashoffset')).toBe('3%')
    expect(line.getAttribute('stroke-dasharray')).toBe('3% 2%')
  })
})
