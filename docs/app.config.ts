const motions = {
  common: {
    initial: {
      y: 100,
      opacity: 0,
      transition: { mass: 0.5, damping: 10 },
    },
    visibleOnce: {
      y: 0,
      opacity: 1,
      transition: { mass: 0.5, damping: 10 },
    },
  },
  presetSection: {
    initial: { y: 100, opacity: 0 },
    visibleOnce: { y: 0, opacity: 1 },
  },
  a: {
    initial: {
      y: '0em',
      opacity: 1,
      scale: 1,
      transition: { stiffness: 250, mass: 0.5, damping: 5 },
    },
    visibleOnce: {
      y: '0em',
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { stiffness: 250, mass: 0.5, damping: 5 },
    },
    hovered: {
      scale: 1.1,
      transition: { stiffness: 250, mass: 0.5, damping: 5 },
    },
    tapped: {
      scale: 0.95,
      transition: { stiffness: 250, mass: 0.5, damping: 5 },
    },
  },
  codeGroupButton: {
    initial: {
      scale: 1,
      transition: { stiffness: 250, mass: 0.5, damping: 5 },
    },
    hovered: {
      scale: 1.1,
      transition: { stiffness: 250, mass: 0.5, damping: 5 },
    },
    tapped: {
      scale: 0.95,
      transition: { stiffness: 250, mass: 0.5, damping: 5 },
    },
  },
  pre: {
    initial: { y: 100, opacity: 0, transition: { mass: 0.1, damping: 10 } },
    visibleOnce: { y: 0, opacity: 1, transition: { mass: 0.1, damping: 10 } },
  },
  code: {
    initial: {
      scaleY: 0.5,
      opacity: 0,
      transition: { stiffness: 250, mass: 0.5, damping: 10 },
    },
    visibleOnce: {
      scaleY: 1,
      opacity: 1,
      transition: { stiffness: 250, mass: 0.5, damping: 10 },
    },
  },
  ul: {
    initial: { x: 100, y: 100, opacity: 0 },
    visibleOnce: { x: 0, y: 0, opacity: 1 },
  },
  li: {
    initial: { x: 40, y: 20, opacity: 0 },
    hovered: {
      x: 10,
      opacity: 1,
      transition: { mass: 1, delay: 0 },
    },
    visibleOnce: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { mass: 1 },
    },
  },
  pageHeader: {
    initial: { y: 100, opacity: 0, transition: { mass: 0.25, damping: 10 } },
    visibleOnce: {
      y: 0,
      opacity: 1,
      transition: { mass: 0.25, damping: 10 },
    },
  },
  headers: {
    h1: {
      initial: {
        y: 100,
        opacity: 0,
        transition: { mass: 0.85, damping: 10 },
      },
      visibleOnce: {
        y: 0,
        opacity: 1,
        transition: { mass: 0.85, damping: 10 },
      },
    },
    common: {
      initial: {
        y: 100,
        opacity: 0,
        transition: { mass: 0.75, damping: 10 },
      },
      visibleOnce: {
        y: 0,
        opacity: 1,
        transition: { mass: 0.75, damping: 10 },
      },
    },
  },
}

/**
 * This is to disable animations, the animations are a bit much and need tweaking
 * we should also provide a way for users to disable them when enabled.
 */
for (const val of Object.values(motions)) {
  // set each variant to an empty object
  for (const k of Object.keys(val)) {
    // h1,common are nested reset their variants to an empty object
    if (['h1', 'common'].includes(k)) {
      // @ts-expect-error not specific
      for (const nestedK of Object.keys(val[k])) {
        // @ts-expect-error not specific
        val[k][nestedK] = {}
      }
    }
    else {
      // @ts-expect-error not specific
      val[k] = {}
    }
  }
}

export default defineAppConfig({
  ui: {
    primary: 'cyan',
    gray: 'neutral',
  },
  header: {
    search: true,
    colorMode: true,
    links: [
      {
        'icon': 'i-simple-icons-github',
        'to': 'https://github.com/vueuse/motion',
        'target': '_blank',
        'aria-label': 'VueUse Motion',
      },
    ],
  },
  seo: { siteName: '@vueuse/motion' },
  footer: {
    credits: `Copyright © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [
      {
        'icon': 'i-simple-icons-github',
        'to': 'https://github.com/vueuse/motion',
        'target': '_blank',
        'aria-label': 'VueUse Motion',
      },
    ],
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      edit: 'https://github.com/vueuse/motion/edit/main/content',
    },
  },

  motions,
})
