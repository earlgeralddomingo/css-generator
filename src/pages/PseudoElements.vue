<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    ChevronDown,
    Code2,
    Copy,
    Eye,
    Layers3,
    RotateCcw,
    Sparkles,
    WandSparkles,
} from 'lucide-vue-next'

const copied = ref(false)

const defaultSettings = {
    content: '"NEW"',
    position: 'absolute',

    top: '10px',
    right: '10px',
    bottom: 'auto',
    left: 'auto',

    width: 'auto',
    height: 'auto',

    background: '#167fa8',
    backgroundImage: 'none',
    backgroundSize: 'auto',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',

    color: '#ffffff',

    fontSize: '12px',
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'center',
    whiteSpace: 'normal',
    textTransform: 'none',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    padding: '6px 10px',
    margin: '0',

    border: 'none',
    borderStyle: 'solid',
    borderWidth: '0',
    borderRadius: '999px',

    opacity: '1',
    zIndex: '2',
    visibility: 'visible',
    overflow: 'visible',
    pointerEvents: 'auto',
    boxSizing: 'border-box',

    transform: 'none',
    transformOrigin: 'center',

    boxShadow: 'none',
    filter: 'none',
    mixBlendMode: 'normal',

    cursor: 'default',

    transition: 'none',
}

const settings = ref({
    ...defaultSettings,
})

const elementType = ref('before')
const targetSelector = ref('.demo-card')
const demoText = ref('Pseudo Element')

const activeSection = ref('content')

const presets = [
    {
        name: 'Badge',
        description: 'Notification badge',
        settings: {
            ...defaultSettings,
            content: '"NEW"',
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#167fa8',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '600',
            borderRadius: '999px',
            display: 'flex',
            padding: '6px 10px',
        },
    },
    {
        name: 'Overlay',
        description: 'Full card overlay',
        settings: {
            ...defaultSettings,
            content: '""',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            background: 'rgba(22, 127, 168, 0.25)',
            borderRadius: '0',
            display: 'block',
            padding: '0',
        },
    },
    {
        name: 'Arrow',
        description: 'Directional arrow',
        settings: {
            ...defaultSettings,
            content: '""',
            top: '50%',
            right: '-8px',
            width: '16px',
            height: '16px',
            background: '#167fa8',
            borderRadius: '0',
            display: 'block',
            transform: 'translateY(-50%) rotate(45deg)',
            padding: '0',
        },
    },
    {
        name: 'Glow',
        description: 'Decorative glow',
        settings: {
            ...defaultSettings,
            content: '""',
            top: '-10px',
            right: '-10px',
            bottom: '-10px',
            left: '-10px',
            background: 'rgba(22, 127, 168, 0.18)',
            borderRadius: '20px',
            zIndex: '-1',
            display: 'block',
            padding: '0',
            boxShadow: '0 0 40px rgba(22, 127, 168, 0.35)',
        },
    },
    {
        name: 'Ribbon',
        description: 'Corner ribbon',
        settings: {
            ...defaultSettings,
            content: '"FEATURED"',
            top: '18px',
            right: '-35px',
            width: '130px',
            height: '28px',
            background: '#167fa8',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '700',
            textAlign: 'center',
            display: 'flex',
            padding: '0',
            transform: 'rotate(45deg)',
        },
    },
    {
        name: 'Quote',
        description: 'Decorative quotation',
        settings: {
            ...defaultSettings,
            content: '"“"',
            position: 'absolute',
            top: '-30px',
            left: '10px',
            color: '#167fa8',
            background: 'transparent',
            fontSize: '80px',
            fontWeight: '900',
            lineHeight: '1',
            display: 'block',
            padding: '0',
        },
    },
    {
        name: 'Line',
        description: 'Accent line',
        settings: {
            ...defaultSettings,
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '0',
            width: '60px',
            height: '4px',
            background: '#167fa8',
            borderRadius: '999px',
            display: 'block',
            padding: '0',
        },
    },
    {
        name: 'Glass',
        description: 'Glass effect',
        settings: {
            ...defaultSettings,
            content: '""',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            display: 'block',
            padding: '0',
        },
    },
]

const selectOptions = {
    position: [
        'static',
        'relative',
        'absolute',
        'fixed',
        'sticky',
    ],

    display: [
        'block',
        'inline',
        'inline-block',
        'flex',
        'inline-flex',
        'grid',
        'inline-grid',
        'none',
    ],

    alignItems: [
        'stretch',
        'flex-start',
        'center',
        'flex-end',
        'baseline',
    ],

    justifyContent: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
    ],

    fontWeight: [
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
        'normal',
        'bold',
    ],

    fontStyle: [
        'normal',
        'italic',
        'oblique',
    ],

    textAlign: [
        'left',
        'center',
        'right',
        'justify',
        'start',
        'end',
    ],

    whiteSpace: [
        'normal',
        'nowrap',
        'pre',
        'pre-wrap',
        'pre-line',
        'break-spaces',
    ],

    textTransform: [
        'none',
        'capitalize',
        'uppercase',
        'lowercase',
    ],

    backgroundSize: [
        'auto',
        'cover',
        'contain',
    ],

    backgroundPosition: [
        'center',
        'top',
        'right',
        'bottom',
        'left',
        'top left',
        'top center',
        'top right',
        'center left',
        'center right',
        'bottom left',
        'bottom center',
        'bottom right',
    ],

    backgroundRepeat: [
        'no-repeat',
        'repeat',
        'repeat-x',
        'repeat-y',
        'space',
        'round',
    ],

    visibility: [
        'visible',
        'hidden',
        'collapse',
    ],

    overflow: [
        'visible',
        'hidden',
        'clip',
        'scroll',
        'auto',
    ],

    pointerEvents: [
        'auto',
        'none',
        'visible',
        'painted',
        'fill',
        'stroke',
    ],

    boxSizing: [
        'border-box',
        'content-box',
    ],

    mixBlendMode: [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
    ],

    cursor: [
        'default',
        'pointer',
        'none',
        'not-allowed',
        'grab',
        'grabbing',
        'move',
        'text',
        'wait',
        'help',
        'crosshair',
    ],

    borderStyle: [
        'none',
        'solid',
        'dashed',
        'dotted',
        'double',
        'groove',
        'ridge',
        'inset',
        'outset',
    ],
}

const generatedCss = computed(() => {
    const pseudo =
        elementType.value === 'before'
            ? '::before'
            : '::after'

    return `${targetSelector.value}${pseudo} {
    content: ${settings.value.content};
    position: ${settings.value.position};
    top: ${settings.value.top};
    right: ${settings.value.right};
    bottom: ${settings.value.bottom};
    left: ${settings.value.left};
    width: ${settings.value.width};
    height: ${settings.value.height};
    background: ${settings.value.background};
    background-image: ${settings.value.backgroundImage};
    background-size: ${settings.value.backgroundSize};
    background-position: ${settings.value.backgroundPosition};
    background-repeat: ${settings.value.backgroundRepeat};
    color: ${settings.value.color};
    font-size: ${settings.value.fontSize};
    font-weight: ${settings.value.fontWeight};
    font-style: ${settings.value.fontStyle};
    line-height: ${settings.value.lineHeight};
    letter-spacing: ${settings.value.letterSpacing};
    text-align: ${settings.value.textAlign};
    white-space: ${settings.value.whiteSpace};
    text-transform: ${settings.value.textTransform};
    display: ${settings.value.display};
    align-items: ${settings.value.alignItems};
    justify-content: ${settings.value.justifyContent};
    padding: ${settings.value.padding};
    margin: ${settings.value.margin};
    border: ${settings.value.border};
    border-radius: ${settings.value.borderRadius};
    opacity: ${settings.value.opacity};
    z-index: ${settings.value.zIndex};
    visibility: ${settings.value.visibility};
    overflow: ${settings.value.overflow};
    pointer-events: ${settings.value.pointerEvents};
    box-sizing: ${settings.value.boxSizing};
    transform: ${settings.value.transform};
    transform-origin: ${settings.value.transformOrigin};
    box-shadow: ${settings.value.boxShadow};
    filter: ${settings.value.filter};
    mix-blend-mode: ${settings.value.mixBlendMode};
    cursor: ${settings.value.cursor};
    transition: ${settings.value.transition};
}`
})

const previewStyle = computed(() => ({
    '--pseudo-content': settings.value.content,
    '--pseudo-position': settings.value.position,
    '--pseudo-top': settings.value.top,
    '--pseudo-right': settings.value.right,
    '--pseudo-bottom': settings.value.bottom,
    '--pseudo-left': settings.value.left,
    '--pseudo-width': settings.value.width,
    '--pseudo-height': settings.value.height,
    '--pseudo-background': settings.value.background,
    '--pseudo-background-image': settings.value.backgroundImage,
    '--pseudo-background-size': settings.value.backgroundSize,
    '--pseudo-background-position':
        settings.value.backgroundPosition,
    '--pseudo-background-repeat':
        settings.value.backgroundRepeat,
    '--pseudo-color': settings.value.color,
    '--pseudo-font-size': settings.value.fontSize,
    '--pseudo-font-weight': settings.value.fontWeight,
    '--pseudo-font-style': settings.value.fontStyle,
    '--pseudo-line-height': settings.value.lineHeight,
    '--pseudo-letter-spacing':
        settings.value.letterSpacing,
    '--pseudo-text-align': settings.value.textAlign,
    '--pseudo-white-space': settings.value.whiteSpace,
    '--pseudo-text-transform':
        settings.value.textTransform,
    '--pseudo-display': settings.value.display,
    '--pseudo-align-items': settings.value.alignItems,
    '--pseudo-justify-content':
        settings.value.justifyContent,
    '--pseudo-padding': settings.value.padding,
    '--pseudo-margin': settings.value.margin,
    '--pseudo-border': settings.value.border,
    '--pseudo-border-radius':
        settings.value.borderRadius,
    '--pseudo-opacity': settings.value.opacity,
    '--pseudo-z-index': settings.value.zIndex,
    '--pseudo-visibility': settings.value.visibility,
    '--pseudo-overflow': settings.value.overflow,
    '--pseudo-pointer-events':
        settings.value.pointerEvents,
    '--pseudo-box-sizing': settings.value.boxSizing,
    '--pseudo-transform': settings.value.transform,
    '--pseudo-transform-origin':
        settings.value.transformOrigin,
    '--pseudo-box-shadow': settings.value.boxShadow,
    '--pseudo-filter': settings.value.filter,
    '--pseudo-mix-blend-mode':
        settings.value.mixBlendMode,
    '--pseudo-cursor': settings.value.cursor,
    '--pseudo-transition': settings.value.transition,
}))

const copyCss = async () => {
    try {
        await navigator.clipboard.writeText(
            generatedCss.value,
        )

        copied.value = true

        window.setTimeout(() => {
            copied.value = false
        }, 1500)
    } catch {
        copied.value = false
    }
}

const applyPreset = (preset) => {
    settings.value = {
        ...preset.settings,
    }
}

const reset = () => {
    settings.value = {
        ...defaultSettings,
    }

    elementType.value = 'before'
    targetSelector.value = '.demo-card'
    demoText.value = 'Pseudo Element'
    activeSection.value = 'content'
    copied.value = false
}

const setColor = (key, event) => {
    settings.value[key] = event.target.value
}
</script>

<template>
    <main class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-gray-950 dark:text-gray-100">
        <!-- Header -->
        <section class="border-b border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                <div class="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400">
                            <WandSparkles class="h-3.5 w-3.5" />
                            CSS Builder
                        </div>

                        <h1 class="text-3xl font-bold tracking-tight text-[#10233f] dark:text-gray-100 sm:text-4xl">
                            Pseudo Elements Generator
                        </h1>

                        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400">
                            Build advanced
                            <code class="rounded bg-slate-100 px-1 font-mono dark:bg-gray-800">
                                ::before
                            </code>
                            and
                            <code class="rounded bg-slate-100 px-1 font-mono dark:bg-gray-800">
                                ::after
                            </code>
                            elements with live styling, presets and
                            production-ready CSS.
                        </p>
                    </div>

                    <button type="button" @click="reset"
                        class="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 xl:self-center">
                        <RotateCcw class="h-4 w-4" />
                        Reset
                    </button>
                </div>
            </div>
        </section>

        <section class="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">
            <div class="grid gap-6 xl:grid-cols-[370px_minmax(0,1fr)]">
                <!-- Controls -->
                <aside
                    class="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div class="border-b border-slate-200 p-5 dark:border-gray-800">
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">
                                <Layers3 class="h-5 w-5" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                    Element Controls
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Configure every CSS property
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6 p-5">
                        <!-- Target -->
                        <div>
                            <label class="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Target Selector
                            </label>

                            <input v-model="targetSelector" type="text"
                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                        </div>

                        <!-- Element -->
                        <div>
                            <label class="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Pseudo Element
                            </label>

                            <div class="grid grid-cols-2 gap-2">
                                <button type="button" @click="
                                    elementType = 'before'
                                    " class="rounded-xl border px-3 py-2.5 font-mono text-xs font-semibold transition"
                                    :class="elementType ===
                                            'before'
                                            ? 'border-cyan-300 bg-cyan-50 text-[#167fa8] dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                        ">
                                    ::before
                                </button>

                                <button type="button" @click="
                                    elementType = 'after'
                                    " class="rounded-xl border px-3 py-2.5 font-mono text-xs font-semibold transition"
                                    :class="elementType ===
                                            'after'
                                            ? 'border-cyan-300 bg-cyan-50 text-[#167fa8] dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                        ">
                                    ::after
                                </button>
                            </div>
                        </div>

                        <!-- Presets -->
                        <div>
                            <label class="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Quick Presets
                            </label>

                            <div class="grid grid-cols-2 gap-2">
                                <button v-for="preset in presets" :key="preset.name" type="button" @click="
                                    applyPreset(preset)
                                    "
                                    class="rounded-xl border border-slate-200 px-3 py-2.5 text-left transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-gray-700 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30">
                                    <span class="block text-xs font-semibold text-slate-700 dark:text-gray-200">
                                        {{ preset.name }}
                                    </span>

                                    <span class="mt-0.5 block text-[10px] text-slate-400">
                                        {{
                                            preset.description
                                        }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'content'
                                    ? ''
                                    : 'content'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Content
                                </span>

                                <ChevronDown class="h-4 w-4 transition" :class="activeSection ===
                                        'content'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'content'
                            " class="space-y-4 border-t border-slate-200 p-4 dark:border-gray-800">
                                <div>
                                    <label
                                        class="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Content Value
                                    </label>

                                    <input v-model="settings.content
                                        " type="text" placeholder='"NEW"'
                                        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <p class="mt-1.5 text-[10px] text-slate-400">
                                        Use quotes for text or
                                        <code>""</code>
                                        for decorative elements.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        class="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Position
                                    </label>

                                    <select v-model="settings.position
                                        "
                                        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.position" :key="option" :value="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Position -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'position'
                                    ? ''
                                    : 'position'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Position & Size
                                </span>

                                <ChevronDown class="h-4 w-4" :class="activeSection ===
                                        'position'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'position'
                            " class="space-y-4 border-t border-slate-200 p-4 dark:border-gray-800">
                                <div class="grid grid-cols-2 gap-2">
                                    <input v-model="settings.top
                                        " placeholder="Top"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <input v-model="settings.right
                                        " placeholder="Right"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <input v-model="settings.bottom
                                        " placeholder="Bottom"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <input v-model="settings.left
                                        " placeholder="Left"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <input v-model="settings.width
                                        " placeholder="Width"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <input v-model="settings.height
                                        " placeholder="Height"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <input v-model="settings.padding
                                        " placeholder="Padding"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <input v-model="settings.margin
                                        " placeholder="Margin"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                                </div>
                            </div>
                        </div>

                        <!-- Background -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'background'
                                    ? ''
                                    : 'background'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Background
                                </span>

                                <ChevronDown class="h-4 w-4" :class="activeSection ===
                                        'background'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'background'
                            " class="space-y-4 border-t border-slate-200 p-4 dark:border-gray-800">
                                <div>
                                    <label
                                        class="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Background
                                    </label>

                                    <div class="flex gap-2">
                                        <input :value="settings.background
                                            " @input="
                                                setColor(
                                                    'background',
                                                    $event,
                                                )
                                                " type="color"
                                            class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900" />

                                        <input v-model="settings.background
                                            " type="text"
                                            class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        class="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Background Image
                                    </label>

                                    <input v-model="settings.backgroundImage
                                        " placeholder="url(...) or linear-gradient(...)"
                                        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <select v-model="settings.backgroundSize
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.backgroundSize" :key="option"
                                            :value="option">
                                            {{ option }}
                                        </option>
                                    </select>

                                    <select v-model="settings.backgroundRepeat
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.backgroundRepeat" :key="option"
                                            :value="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                </div>

                                <select v-model="settings.backgroundPosition
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.backgroundPosition" :key="option"
                                        :value="option">
                                        {{ option }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Typography -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'typography'
                                    ? ''
                                    : 'typography'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Typography
                                </span>

                                <ChevronDown class="h-4 w-4" :class="activeSection ===
                                        'typography'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'typography'
                            " class="space-y-3 border-t border-slate-200 p-4 dark:border-gray-800">
                                <div class="grid grid-cols-2 gap-2">
                                    <input v-model="settings.fontSize
                                        " placeholder="Font size"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <select v-model="settings.fontWeight
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.fontWeight" :key="option"
                                            :value="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <select v-model="settings.fontStyle
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.fontStyle" :key="option" :value="option">
                                            {{ option }}
                                        </option>
                                    </select>

                                    <select v-model="settings.textAlign
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.textAlign" :key="option" :value="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <input v-model="settings.lineHeight
                                        " placeholder="Line height"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <input v-model="settings.letterSpacing
                                        " placeholder="Letter spacing"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <select v-model="settings.textTransform
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.textTransform" :key="option"
                                            :value="option">
                                            {{ option }}
                                        </option>
                                    </select>

                                    <select v-model="settings.whiteSpace
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.whiteSpace" :key="option"
                                            :value="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        class="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Text Color
                                    </label>

                                    <div class="flex gap-2">
                                        <input :value="settings.color
                                            " @input="
                                                setColor(
                                                    'color',
                                                    $event,
                                                )
                                                " type="color"
                                            class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900" />

                                        <input v-model="settings.color
                                            " type="text"
                                            class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Layout -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'layout'
                                    ? ''
                                    : 'layout'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Layout & Display
                                </span>

                                <ChevronDown class="h-4 w-4" :class="activeSection ===
                                        'layout'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'layout'
                            " class="space-y-3 border-t border-slate-200 p-4 dark:border-gray-800">
                                <select v-model="settings.display
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.display" :key="option" :value="option">
                                        Display: {{ option }}
                                    </option>
                                </select>

                                <div class="grid grid-cols-2 gap-2">
                                    <select v-model="settings.alignItems
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.alignItems" :key="option"
                                            :value="option">
                                            {{ option }}
                                        </option>
                                    </select>

                                    <select v-model="settings.justifyContent
                                        "
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                        <option v-for="option in selectOptions.justifyContent" :key="option"
                                            :value="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                </div>

                                <select v-model="settings.boxSizing
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.boxSizing" :key="option" :value="option">
                                        Box sizing: {{ option }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Border -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'border'
                                    ? ''
                                    : 'border'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Border
                                </span>

                                <ChevronDown class="h-4 w-4" :class="activeSection ===
                                        'border'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'border'
                            " class="space-y-3 border-t border-slate-200 p-4 dark:border-gray-800">
                                <input v-model="settings.border
                                    " placeholder="1px solid #000"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                <select v-model="settings.borderStyle
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.borderStyle" :key="option" :value="option">
                                        {{ option }}
                                    </option>
                                </select>

                                <input v-model="settings.borderWidth
                                    " placeholder="Border width"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                <input v-model="settings.borderRadius
                                    " placeholder="Border radius"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                            </div>
                        </div>

                        <!-- Effects -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'effects'
                                    ? ''
                                    : 'effects'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Effects & Behavior
                                </span>

                                <ChevronDown class="h-4 w-4" :class="activeSection ===
                                        'effects'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'effects'
                            " class="space-y-3 border-t border-slate-200 p-4 dark:border-gray-800">
                                <div class="grid grid-cols-2 gap-2">
                                    <input v-model="settings.opacity
                                        " placeholder="Opacity"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                    <input v-model="settings.zIndex
                                        " placeholder="Z-index"
                                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                                </div>

                                <select v-model="settings.visibility
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.visibility" :key="option" :value="option">
                                        Visibility:
                                        {{ option }}
                                    </option>
                                </select>

                                <select v-model="settings.overflow
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.overflow" :key="option" :value="option">
                                        Overflow: {{ option }}
                                    </option>
                                </select>

                                <select v-model="settings.pointerEvents
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.pointerEvents" :key="option" :value="option">
                                        Pointer events:
                                        {{ option }}
                                    </option>
                                </select>

                                <select v-model="settings.cursor
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.cursor" :key="option" :value="option">
                                        Cursor: {{ option }}
                                    </option>
                                </select>

                                <select v-model="settings.mixBlendMode
                                    "
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    <option v-for="option in selectOptions.mixBlendMode" :key="option" :value="option">
                                        Blend: {{ option }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Transform -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'transform'
                                    ? ''
                                    : 'transform'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Transform
                                </span>

                                <ChevronDown class="h-4 w-4" :class="activeSection ===
                                        'transform'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'transform'
                            " class="space-y-3 border-t border-slate-200 p-4 dark:border-gray-800">
                                <input v-model="settings.transform
                                    " placeholder="translateY(-50%) rotate(45deg)"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                <input v-model="settings.transformOrigin
                                    " placeholder="center"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                <input v-model="settings.filter
                                    " placeholder="blur(5px) brightness(1.2)"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                            </div>
                        </div>

                        <!-- Shadow / Transition -->
                        <div class="rounded-xl border border-slate-200 dark:border-gray-800">
                            <button type="button" @click="
                                activeSection =
                                activeSection ===
                                    'animation'
                                    ? ''
                                    : 'animation'
                                " class="flex w-full items-center justify-between px-4 py-3 text-left">
                                <span class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Shadow & Transition
                                </span>

                                <ChevronDown class="h-4 w-4" :class="activeSection ===
                                        'animation'
                                        ? 'rotate-180'
                                        : ''
                                    " />
                            </button>

                            <div v-if="
                                activeSection ===
                                'animation'
                            " class="space-y-3 border-t border-slate-200 p-4 dark:border-gray-800">
                                <input v-model="settings.boxShadow
                                    " placeholder="0 10px 30px rgba(0,0,0,.2)"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />

                                <input v-model="settings.transition
                                    " placeholder="all .3s ease"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">
                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-gray-800">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">
                                <Eye class="h-5 w-5" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                    Live Preview
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Changes are rendered instantly
                                </p>
                            </div>
                        </div>

                        <div
                            class="flex min-h-[480px] items-center justify-center bg-[#f8fafc] p-6 dark:bg-gray-950 sm:p-10">
                            <div class="pseudo-wrapper relative w-full max-w-lg" :style="previewStyle">
                                <div
                                    class="demo-card relative overflow-visible rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg dark:border-gray-700 dark:bg-gray-900">
                                    <div
                                        class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">
                                        <Code2 class="h-7 w-7" />
                                    </div>

                                    <h3 class="mt-5 text-2xl font-bold text-[#10233f] dark:text-gray-100">
                                        {{ demoText }}
                                    </h3>

                                    <p class="mt-2 text-sm text-slate-500 dark:text-gray-400">
                                        Your
                                        <span class="font-mono text-cyan-600 dark:text-cyan-400">
                                            ::{{
                                                elementType
                                            }}
                                        </span>
                                        element is rendered
                                        here.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950">
                            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Preview Text
                                    </p>

                                    <input v-model="demoText" type="text"
                                        class="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                                </div>

                                <code
                                    class="rounded-lg bg-white px-3 py-2 text-xs text-cyan-700 dark:bg-gray-900 dark:text-cyan-400">
                                    {{ targetSelector }}::{{
                                        elementType
                                    }}
                                </code>
                            </div>
                        </div>
                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                                    <Code2 class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                        Generated CSS
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        Production-ready CSS
                                    </p>
                                </div>
                            </div>

                            <button type="button" @click="copyCss"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">
                                <Check v-if="copied" class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{
                                    copied
                                        ? 'Copied'
                                        : 'Copy CSS'
                                }}
                            </button>
                        </div>

                        <pre
                            class="max-h-[600px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>
                    </section>

                    <!-- Info -->
                    <section
                        class="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5 dark:border-cyan-900/50 dark:bg-cyan-950/20">
                        <div class="flex gap-3">
                            <Sparkles class="mt-0.5 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />

                            <div>
                                <h3 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                    Pseudo Elements
                                </h3>

                                <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-gray-400">
                                    Use pseudo elements to create
                                    badges, decorative lines,
                                    overlays, arrows, ribbons,
                                    quotation marks, glows and
                                    other UI effects without adding
                                    additional HTML elements.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
.pseudo-wrapper {
    position: relative;
}

.demo-card::before,
.demo-card::after {
    content: var(--pseudo-content);
    position: var(--pseudo-position);

    top: var(--pseudo-top);
    right: var(--pseudo-right);
    bottom: var(--pseudo-bottom);
    left: var(--pseudo-left);

    width: var(--pseudo-width);
    height: var(--pseudo-height);

    background: var(--pseudo-background);
    background-image: var(--pseudo-background-image);
    background-size: var(--pseudo-background-size);
    background-position: var(--pseudo-background-position);
    background-repeat: var(--pseudo-background-repeat);

    color: var(--pseudo-color);

    font-size: var(--pseudo-font-size);
    font-weight: var(--pseudo-font-weight);
    font-style: var(--pseudo-font-style);
    line-height: var(--pseudo-line-height);
    letter-spacing: var(--pseudo-letter-spacing);
    text-align: var(--pseudo-text-align);
    white-space: var(--pseudo-white-space);
    text-transform: var(--pseudo-text-transform);

    display: var(--pseudo-display);
    align-items: var(--pseudo-align-items);
    justify-content: var(--pseudo-justify-content);

    padding: var(--pseudo-padding);
    margin: var(--pseudo-margin);

    border: var(--pseudo-border);
    border-radius: var(--pseudo-border-radius);

    opacity: var(--pseudo-opacity);
    z-index: var(--pseudo-z-index);
    visibility: var(--pseudo-visibility);
    overflow: var(--pseudo-overflow);
    pointer-events: var(--pseudo-pointer-events);
    box-sizing: var(--pseudo-box-sizing);

    transform: var(--pseudo-transform);
    transform-origin: var(--pseudo-transform-origin);

    box-shadow: var(--pseudo-box-shadow);
    filter: var(--pseudo-filter);
    mix-blend-mode: var(--pseudo-mix-blend-mode);

    cursor: var(--pseudo-cursor);
    transition: var(--pseudo-transition);
}

.pseudo-wrapper .demo-card::after {
    content: none;
}

.pseudo-wrapper .demo-card::before {
    content: var(--pseudo-content);
}

.pseudo-wrapper:has(.demo-card)::after {
    content: none;
}

.pseudo-wrapper .demo-card.pseudo-after::before {
    content: none;
}
</style>