import {
    createRouter,
    createWebHistory,
} from 'vue-router'

// Pages
import Home from '../pages/Home.vue'
import Grid from '../pages/Grid.vue'
import GridTemplateAreas from '../pages/GridTemplateAreas.vue'
import Flexbox from '../pages/Flexbox.vue'
import BoxShadow from '../pages/BoxShadow.vue'
import TextShadow from '../pages/TextShadow.vue'
import BorderRadius from '../pages/BorderRadius.vue'
import Spacing from '../pages/Spacing.vue'
import Typography from '../pages/Typography.vue'
import Colors from '../pages/Colors.vue'
import Backgrounds from '../pages/Backgrounds.vue'
import Animations from '../pages/Animations.vue'
import Transform from '../pages/Transform.vue'
import FilterEffects from '../pages/FilterEffects.vue'
import FilterAnimations from '../pages/FilterAnimations.vue'
import CSSVariables from '../pages/CSSVariables.vue'
import ClipPath from '../pages/ClipPath.vue'
import Masking from '../pages/Masking.vue'
import Columns from '../pages/Columns.vue'
import Outline from '../pages/Outline.vue'
import PseudoElements from '../pages/PseudoElements.vue'
import GridAutoPlacement from '../pages/GridAutoPlacement.vue'
import BoxSizing from '../pages/BoxSizing.vue'
import FontFace from '../pages/FontFace.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },

    // Layout
    {
        path: '/grid',
        name: 'grid',
        component: Grid,
    },
    {
        path: '/grid-areas',
        name: 'grid-template-areas',
        component: GridTemplateAreas,
    },
    {
        path: '/flexbox',
        name: 'flexbox',
        component: Flexbox,
    },
    {
        path: '/columns',
        name: 'columns',
        component: Columns,
    },
    {
        path: '/grid-auto',
        name: 'grid-auto-placement',
        component: GridAutoPlacement,
    },

    // Visual
    {
        path: '/box-shadow',
        name: 'box-shadow',
        component: BoxShadow,
    },
    {
        path: '/text-shadow',
        name: 'text-shadow',
        component: TextShadow,
    },
    {
        path: '/border-radius',
        name: 'border-radius',
        component: BorderRadius,
    },
    {
        path: '/colors',
        name: 'colors',
        component: Colors,
    },
    {
        path: '/backgrounds',
        name: 'backgrounds',
        component: Backgrounds,
    },
    {
        path: '/outline',
        name: 'outline',
        component: Outline,
    },
    {
        path: '/clip-path',
        name: 'clip-path',
        component: ClipPath,
    },
    {
        path: '/masking',
        name: 'masking',
        component: Masking,
    },

    // Spacing
    {
        path: '/spacing',
        name: 'spacing',
        component: Spacing,
    },
    {
        path: '/box-sizing',
        name: 'box-sizing',
        component: BoxSizing,
    },

    // Typography
    {
        path: '/typography',
        name: 'typography',
        component: Typography,
    },
    {
        path: '/font-face',
        name: 'font-face',
        component: FontFace,
    },

    // Animation & Effects
    {
        path: '/animations',
        name: 'animations',
        component: Animations,
    },
    {
        path: '/transform',
        name: 'transform',
        component: Transform,
    },
    {
        path: '/filters',
        name: 'filter-effects',
        component: FilterEffects,
    },
    {
        path: '/filter-animations',
        name: 'filter-animations',
        component: FilterAnimations,
    },

    // Advanced
    {
        path: '/css-variables',
        name: 'css-variables',
        component: CSSVariables,
    },
    {
        path: '/pseudo-elements',
        name: 'pseudo-elements',
        component: PseudoElements,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router