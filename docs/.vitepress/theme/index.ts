import { h } from 'vue'
import { useData, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    const { frontmatter } = useData()

    return h(DefaultTheme.Layout, null, {
      'layout-top': () => {
        if (frontmatter.value.layout !== 'home') return null

        return h('img', {
          class: 'shared-orbit-home-logo',
          src: withBase('/shared-orbit-icon.png'),
          alt: 'Shared Orbit'
        })
      }
    })
  }
}
