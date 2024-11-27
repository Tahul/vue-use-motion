interface PageMeta {
  title: string
  description: string
  headline: string
}

export default function () {
  function setPageMeta(newPageMeta: PageMeta) {
    const { title = '', description = '', headline = '' } = newPageMeta
    useSeoMeta({ title, ogTitle: title, description, ogDescription: description })
    defineOgImage({ component: 'Docs', title, description, headline })
  }

  return { setPageMeta }
}
