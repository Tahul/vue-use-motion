import type { MaybeRef } from '@vueuse/core'
import { watch } from 'vue'
import { reactiveStyle } from './reactiveStyle'
import type { MotionTarget, PermissiveTarget, SVGPathProperties, StyleProperties } from './types'
import { usePermissiveTarget } from './usePermissiveTarget'
import { getSVGPath, isSVGElement, isSVGPathProp, setSVGPath, valueTypes } from './utils/style'
import { isTransformOriginProp, isTransformProp } from './utils/transform'

/**
 * A Composable giving access to a StyleProperties object, and binding the generated style object to a target.
 *
 * @param target
 */
export function useElementStyle(target: MaybeRef<PermissiveTarget>, onInit?: (initData: Partial<StyleProperties>) => void) {
  // Transform cache available before the element is mounted
  let _cache: StyleProperties | SVGPathProperties | undefined
  // Local target cache as we need to resolve the element from PermissiveTarget
  let _target: MotionTarget
  // Create a reactive style object
  const { state, style } = reactiveStyle()

  usePermissiveTarget(target, (el) => {
    _target = el

    if (isSVGElement(_target)) {
      const { pathLength, pathSpacing, pathOffset } = getSVGPath(_target as SVGElement)
      if (pathLength !== undefined) {
        (state as SVGPathProperties).pathLength = pathLength;
        (state as SVGPathProperties).pathSpacing = pathSpacing;
        (state as SVGPathProperties).pathOffset = pathOffset
      }
    }

    // Loop on style keys
    for (const key of Object.keys(valueTypes)) {
      // @ts-expect-error - Fix errors later for typescript 5
      if (el.style[key] === null || el.style[key] === '' || isTransformProp(key) || isTransformOriginProp(key) || isSVGPathProp(key))
        continue

      // Append a defined key to the local StyleProperties state object
      // @ts-expect-error - Fix errors later for typescript 5
      state[key] = el.style[key]
    }

    // If cache is present, init the target with the current cached value
    if (_cache) {
      if (isSVGElement(_target)) {
        const { pathLength, pathOffset, pathSpacing } = _cache as SVGPathProperties
        if (pathLength !== undefined) {
          setSVGPath((_target as SVGElement), pathLength, pathSpacing, pathOffset)
        }
      }

      // @ts-expect-error - Fix errors later for typescript 5
      Object.entries(_cache).forEach(([key, value]) => (el.style[key] = value))
    }

    if (onInit)
      onInit(state)
  })

  // Sync reactive style to element
  watch(
    style,
    (newVal) => {
      // Add the current value to the cache so it is set on target creation
      if (!_target) {
        _cache = newVal
        return
      }

      if (isSVGElement(_target)) {
        const { pathLength, pathOffset, pathSpacing } = newVal as SVGPathProperties
        if (pathLength !== undefined) {
          setSVGPath((_target as SVGElement), pathLength, pathSpacing, pathOffset)
        }
      }

      // Append the state object to the target style properties
      // @ts-expect-error - Fix errors later for typescript 5
      for (const key in newVal) _target.style[key] = newVal[key]
    },
    {
      immediate: true,
    },
  )

  return {
    style: state,
  }
}
