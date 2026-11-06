import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './styles/vars.css'
import './styles/base.css'
import './styles/home.css'
import './styles/components.css'

import HeroAurora from './components/HeroAurora.vue'
import FeatureBento from './components/FeatureBento.vue'
import PlatformWall from './components/PlatformWall.vue'
import DeployFlow from './components/DeployFlow.vue'
import TerminalDemo from './components/TerminalDemo.vue'
import SectionHeading from './components/SectionHeading.vue'
import NotFound from './NotFound.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HeroAurora', HeroAurora)
    app.component('FeatureBento', FeatureBento)
    app.component('PlatformWall', PlatformWall)
    app.component('DeployFlow', DeployFlow)
    app.component('TerminalDemo', TerminalDemo)
    app.component('SectionHeading', SectionHeading)
    app.component('NotFound', NotFound)
  },
} satisfies Theme
