import type { Component } from '@nuxt/schema'
import type { PropType } from 'vue'

import { Transition, defineComponent, h, useAttrs, useSlots } from 'vue'
import { variantToStyle } from '../utils/transform'
import { MotionComponentProps, setupMotionComponent } from '../utils/component'

export default defineComponent({
  name: 'Motion',
  props: {
    ...MotionComponentProps,
    is: {
      type: [String, Object] as PropType<string | Component>,
      default: 'div',
    },
    // TODO: figure out if this is possible using `v-if`, otherwise find better prop name
    present: {
      type: Boolean,
      default: true,
    },
  },
  inheritAttrs: false,
  setup(props) {
    const slots = useSlots()

    const { motionConfig, setNodeInstance } = setupMotionComponent(props)
    const attrs = useAttrs()

    return () => {
      const style = variantToStyle(motionConfig.value.initial || {})
      const node = h(props.is, attrs, slots)

      const instance = setNodeInstance(node, 0, style)

      // Wrap component in Transition if leave variant is set
      if (props.leave) {
        const wrapper = h(
          Transition,
          {
            css: false,
            onLeave: (_: any, done: any) => instance.leave(done),
          },
          () => [props.present && node],
        )

        return wrapper
      }

      return node
    }
  },
})
