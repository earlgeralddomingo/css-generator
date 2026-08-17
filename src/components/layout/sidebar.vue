<script setup>
import {
    Home,
    Grid3X3,
    LayoutTemplate,
    StretchHorizontal,
    Square,
    Box,
    Type,
    Palette,
    Image,
    Zap,
    Move,
    Filter,
    SlidersHorizontal,
    Variable,
    Scissors,
    Layers,
    Columns3,
    CircleDot,
    Code2,
} from 'lucide-vue-next'

defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close-sidebar'])

const sections = [
    {
        name: 'Layout',
        items: [
            {
                name: 'Grid',
                icon: Grid3X3,
                path: '/grid',
            },
            {
                name: 'Grid Template Areas',
                icon: LayoutTemplate,
                path: '/grid-areas',
            },
            {
                name: 'Flexbox',
                icon: StretchHorizontal,
                path: '/flexbox',
            },
            {
                name: 'Columns',
                icon: Columns3,
                path: '/columns',
            },
            {
                name: 'Grid Auto Placement',
                icon: Grid3X3,
                path: '/grid-auto',
            },
        ],
    },

    {
        name: 'Visual',
        items: [
            {
                name: 'Box Shadow',
                icon: Box,
                path: '/box-shadow',
            },
            {
                name: 'Text Shadow',
                icon: Type,
                path: '/text-shadow',
            },
            {
                name: 'Border Radius',
                icon: Square,
                path: '/border-radius',
            },
            {
                name: 'Colors',
                icon: Palette,
                path: '/colors',
            },
            {
                name: 'Backgrounds',
                icon: Image,
                path: '/backgrounds',
            },
            {
                name: 'Outline',
                icon: CircleDot,
                path: '/outline',
            },
            {
                name: 'Clip Path',
                icon: Scissors,
                path: '/clip-path',
            },
            {
                name: 'Masking',
                icon: Layers,
                path: '/masking',
            },
        ],
    },

    {
        name: 'Typography',
        items: [
            {
                name: 'Typography',
                icon: Type,
                path: '/typography',
            },
            {
                name: 'Font Face',
                icon: Code2,
                path: '/font-face',
            },
        ],
    },

    {
        name: 'Spacing',
        items: [
            {
                name: 'Spacing',
                icon: StretchHorizontal,
                path: '/spacing',
            },
            {
                name: 'Box Sizing',
                icon: Square,
                path: '/box-sizing',
            },
        ],
    },

    {
        name: 'Animation & Effects',
        items: [
            {
                name: 'Animations',
                icon: Zap,
                path: '/animations',
            },
            {
                name: 'Transform',
                icon: Move,
                path: '/transform',
            },
            {
                name: 'Filter Effects',
                icon: Filter,
                path: '/filters',
            },
            {
                name: 'Filter Animations',
                icon: SlidersHorizontal,
                path: '/filter-animations',
            },
        ],
    },

    {
        name: 'Advanced',
        items: [
            {
                name: 'CSS Variables',
                icon: Variable,
                path: '/css-variables',
            },
            {
                name: 'Pseudo Elements',
                icon: Code2,
                path: '/pseudo-elements',
            },
        ],
    },
]
</script>

<template>
    <!-- Mobile Overlay -->
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" class="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/20 md:hidden"
            @click="emit('close-sidebar')" />
    </Transition>

    <!-- Sidebar -->
    <aside class="
            fixed
            bottom-0
            left-0
            top-16
            z-50
            flex
            w-64
            shrink-0
            flex-col
            border-r
            border-gray-200/80
            bg-gray-50
            transition-transform
            duration-200
            ease-out
            dark:border-gray-800/80
            dark:bg-gray-950
            md:static
            md:top-auto
            md:translate-x-0
        " :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
        <!-- Home -->
        <div class="
                border-b
                border-gray-200/80
                p-3
                dark:border-gray-800/80
            ">
            <RouterLink to="/" @click="emit('close-sidebar')" class="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition-colors
                    hover:bg-gray-200/60
                    hover:text-gray-900
                    dark:text-gray-300
                    dark:hover:bg-gray-800/60
                    dark:hover:text-gray-100
                " active-class="
                    bg-gray-200/70
                    text-gray-900
                    dark:bg-gray-800/70
                    dark:text-gray-100
                ">
                <Home :size="17" :stroke-width="1.8" />

                <span>Home</span>
            </RouterLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-3">
            <div v-for="section in sections" :key="section.name" class="mb-6">
                <!-- Section Title -->
                <p class="
                        mb-2
                        px-3
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-400
                        dark:text-gray-500
                    ">
                    {{ section.name }}
                </p>

                <!-- Section Items -->
                <div class="space-y-1">
                    <RouterLink v-for="item in section.items" :key="item.name" :to="item.path"
                        @click="emit('close-sidebar')" class="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            text-gray-600
                            transition-colors
                            hover:bg-gray-200/60
                            hover:text-gray-900
                            dark:text-gray-400
                            dark:hover:bg-gray-800/60
                            dark:hover:text-gray-100
                        " active-class="
                            bg-gray-200/70
                            text-gray-900
                            dark:bg-gray-800/70
                            dark:text-gray-100
                        ">
                        <component :is="item.icon" :size="16" :stroke-width="1.8" class="shrink-0" />

                        <span>{{ item.name }}</span>
                    </RouterLink>
                </div>
            </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="
                border-t
                border-gray-200/80
                p-3
                dark:border-gray-800/80
            ">
            <p class="
                    px-3
                    text-xs
                    text-gray-400
                    dark:text-gray-500
                ">
                CSS Generator v1.0
            </p>
        </div>
    </aside>
</template>