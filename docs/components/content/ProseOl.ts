export default defineComponent({
  setup() {
    const MotionComponent = resolveComponent('Motion')
    const slots = useSlots()
    const appConfig = useAppConfig()

    return () => {
      const nodes: VNode[] = slots.default?.() || []

      return h(
        'ol',
        {
          ...appConfig.motions.ul,
        },
        nodes.map((node, i) => {
          node.props = {
            is: 'li',
            ...appConfig.motions.li,
            visibleOnce: {
              ...(appConfig.motions.li?.visibleOnce ?? {}),
              transition: {
                ...(appConfig.motions.li?.visibleOnce?.transition ?? {}),
                delay: i * 50,
              },
            },
          }

          // @ts-expect-error type conflict but seems to work fine
          return h(MotionComponent, { ...node.props }, node.children)
        }),
      )
    }
  },
})
