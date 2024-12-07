import {
  type ExtractPropTypes,
  type PropType,
  type VNode,
  computed,
  inject,
  nextTick,
  onUpdated,
  reactive,
  toRaw,
} from 'vue'
import type { LooseRequired } from '@vue/shared'
import defu from 'defu'
import * as presets from '../presets'
import type { MotionInstance } from '../types/instance'
import type {
  MotionVariants,
  StyleProperties,
  Variant,
} from '../types/variants'
import { useMotion } from '../useMotion'
import { variantToStyle } from './transform'
import { CUSTOM_PRESETS } from './keys'

/**
 * Shared component props for <Motion> and <MotionGroup>
 */
export const MotionComponentProps = {
  // Preset to be loaded
  preset: {
    type: String as PropType<string>,
    required: false,
  },
  // Instance
  instance: {
    type: Object as PropType<MotionInstance<string, MotionVariants<string>>>,
    required: false,
  },
  // Variants
  variants: {
    type: Object as PropType<MotionVariants<string>>,
    required: false,
  },
  // Initial variant
  initial: {
    type: Object as PropType<Variant>,
    required: false,
  },
  // Lifecycle hooks variants
  enter: {
    type: Object as PropType<Variant>,
    required: false,
  },
  leave: {
    type: Object as PropType<Variant>,
    required: false,
  },
  // Intersection observer variants
  visible: {
    type: Object as PropType<Variant>,
    required: false,
  },
  visibleOnce: {
    type: Object as PropType<Variant>,
    required: false,
  },
  // Event listeners variants
  hovered: {
    type: Object as PropType<Variant>,
    required: false,
  },
  tapped: {
    type: Object as PropType<Variant>,
    required: false,
  },
  focused: {
    type: Object as PropType<Variant>,
    required: false,
  },
  // Helpers
  delay: {
    type: [Number, String] as PropType<number | string>,
    required: false,
  },
  duration: {
    type: [Number, String] as PropType<number | string>,
    required: false,
  },
}

function isObject(val: unknown): val is Record<any, any> {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * Deep clone object/array
 */
function clone<T>(v: T): any {
  if (Array.isArray(v)) {
    return v.map(clone)
  }

  if (isObject(v)) {
    const res: any = {}
    for (const key in v) {
      res[key] = clone(v[key as keyof typeof v])
    }
    return res
  }

  return v
}

/**
 * Shared logic for <Motion> and <MotionGroup>
 */
export function setupMotionComponent(
  props: LooseRequired<ExtractPropTypes<typeof MotionComponentProps>>,
) {
  // Motion instance map
  const instances = reactive<{
    [key: number]: MotionInstance<string, MotionVariants<string>>
  }>({})

  const customPresets = inject<Record<string, Variant>>(CUSTOM_PRESETS, {})

  // Preset variant or empty object if none is provided
  const preset = computed(() => {
    if (props.preset == null) {
      return {}
    }

    if (customPresets != null && props.preset in customPresets) {
      return structuredClone(toRaw(customPresets)[props.preset])
    }

    if (props.preset in presets) {
      return structuredClone(presets[props.preset as keyof typeof presets])
    }

    return {}
  })

  // Motion configuration using inline prop variants (`:initial` ...)
  const propsConfig = computed(() => ({
    initial: props.initial,
    enter: props.enter,
    leave: props.leave,
    visible: props.visible,
    visibleOnce: props.visibleOnce,
    hovered: props.hovered,
    tapped: props.tapped,
    focused: props.focused,
  }))

  // Applies transition shorthand helpers to passed config
  function applyTransitionHelpers(
    config: typeof propsConfig.value,
    values: Partial<Pick<typeof props, 'delay' | 'duration'>>,
  ) {
    for (const transitionKey of ['delay', 'duration'] as const) {
      if (values[transitionKey] == null)
        continue

      const transitionValueParsed = Number.parseInt(
        values[transitionKey] as string,
      )

      // Apply transition property to existing variants where applicable
      for (const variantKey of ['enter', 'visible', 'visibleOnce'] as const) {
        const variantConfig = config[variantKey]

        if (variantConfig == null)
          continue

        variantConfig.transition ??= {}
        // @ts-expect-error `duration` does not exist on `inertia` type transitions
        variantConfig.transition[transitionKey] = transitionValueParsed
      }
    }

    return config
  }

  // Merged motion configuration using `props.preset`, inline prop variants (`:initial` ...), and `props.variants`
  const motionConfig = computed(() => {
    const config = defu(
      {},
      propsConfig.value,
      preset.value,
      props.variants || {},
    )

    return applyTransitionHelpers({ ...config }, props)
  })

  // Replay animations on component update Vue
  if (import.meta.dev) {
    // Validate passed preset
    if (
      props.preset != null
      && presets?.[props.preset as keyof typeof presets] == null
      && customPresets?.[props.preset] == null
    ) {
      console.warn(`[@vueuse/motion]: Preset \`${props.preset}\` not found.`)
    }

    const replayAnimation = (instance: MotionInstance<any, any>) => {
      if (instance.variants?.initial) {
        instance.set('initial')
      }

      nextTick(() => {
        if (instance.variants?.enter)
          instance.apply('enter')
        if (instance.variants?.visible)
          instance.apply('visible')
        if (instance.variants?.visibleOnce)
          instance.apply('visibleOnce')
      })
    }

    onUpdated(() => {
      for (const key in instances) {
        replayAnimation(instances[key])
      }
    })
  }

  // Set node style and register to `instances` on mount
  function setNodeInstance(node: VNode, index: number, style: StyleProperties) {
    node.props ??= {}
    node.props.style ??= {}

    // Merge node style with variant style
    node.props.style = { ...node.props.style, ...style }

    // Apply transition helpers, this may differ if `node` is a child node
    const elementMotionConfig = applyTransitionHelpers(
      clone(motionConfig.value),
      node.props as Partial<Pick<typeof props, 'delay' | 'duration'>>,
    )

    // Track motion instance locally using `instances`
    node.props.onVnodeMounted = ({ el }) => {
      instances[index] = useMotion<string, MotionVariants<string>>(
        el as any,
        elementMotionConfig,
      )
    }

    /**
     * Vue reapplies all styles every render, include style properties and calculated initially styles get reapplied every render.
     * To prevent this, reapply the current motion state styles in vnode updated lifecycle
     */
    node.props.onVnodeUpdated = ({ el }) => {
      const styles = variantToStyle(instances[index].state as Variant)

      for (const [key, val] of Object.entries(styles)) {
        ;(el as any).style[key] = val
      }
    }

    return node
  }

  return {
    instances,
    motionConfig,
    setNodeInstance,
  }
}
