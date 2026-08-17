<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Pause,
    Play,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
} from 'lucide-vue-next'

const copied = ref(false)
const isPlaying = ref(true)
const animationKey = ref(0)
const activePreset = ref('Fade')
const activeCategory = ref('Presets')

const settings = ref({
    duration: 1.5,
    delay: 0,
    timingFunction: 'ease',
    iterationCount: 'infinite',
    direction: 'normal',
    fillMode: 'both',

    fromBlur: 0,
    fromBrightness: 100,
    fromContrast: 100,
    fromGrayscale: 0,
    fromHueRotate: 0,
    fromInvert: 0,
    fromOpacity: 0,
    fromSaturate: 100,
    fromSepia: 0,

    toBlur: 0,
    toBrightness: 100,
    toContrast: 100,
    toGrayscale: 0,
    toHueRotate: 0,
    toInvert: 0,
    toOpacity: 100,
    toSaturate: 100,
    toSepia: 0,
})

const defaultSettings = { ...settings.value }

const categories = [
    {
        name: 'Presets',
        description: 'Ready-made effects',
    },
    {
        name: 'Animation',
        description: 'Timing controls',
    },
    {
        name: 'From State',
        description: 'Starting values',
    },
    {
        name: 'To State',
        description: 'Ending values',
    },
]

const presets = [
    {
        name: 'Fade',
        category: 'Opacity',
        values: {
            fromOpacity: 0,
            toOpacity: 100,
        },
    },
    {
        name: 'Blur In',
        category: 'Blur',
        values: {
            fromBlur: 15,
            fromOpacity: 0,
            toBlur: 0,
            toOpacity: 100,
        },
    },
    {
        name: 'Blur Out',
        category: 'Blur',
        values: {
            fromBlur: 0,
            fromOpacity: 100,
            toBlur: 15,
            toOpacity: 0,
        },
    },
    {
        name: 'Grayscale',
        category: 'Color',
        values: {
            fromGrayscale: 100,
            toGrayscale: 0,
        },
    },
    {
        name: 'Color Shift',
        category: 'Color',
        values: {
            fromHueRotate: 0,
            toHueRotate: 360,
            fromSaturate: 100,
            toSaturate: 150,
        },
    },
    {
        name: 'Invert',
        category: 'Color',
        values: {
            fromInvert: 100,
            toInvert: 0,
        },
    },
    {
        name: 'Bright',
        category: 'Light',
        values: {
            fromBrightness: 40,
            toBrightness: 130,
        },
    },
    {
        name: 'Darken',
        category: 'Light',
        values: {
            fromBrightness: 130,
            toBrightness: 40,
        },
    },
    {
        name: 'Sepia',
        category: 'Color',
        values: {
            fromSepia: 0,
            toSepia: 100,
        },
    },
]

const controlGroups = {
    from: [
        ['fromBlur', 'Blur', 'px', 0, 20, 0.5],
        ['fromBrightness', 'Brightness', '%', 0, 200, 1],
        ['fromContrast', 'Contrast', '%', 0, 200, 1],
        ['fromGrayscale', 'Grayscale', '%', 0, 100, 1],
        ['fromHueRotate', 'Hue Rotate', '°', -180, 360, 1],
        ['fromInvert', 'Invert', '%', 0, 100, 1],
        ['fromOpacity', 'Opacity', '%', 0, 100, 1],
        ['fromSaturate', 'Saturate', '%', 0, 300, 1],
        ['fromSepia', 'Sepia', '%', 0, 100, 1],
    ],
    to: [
        ['toBlur', 'Blur', 'px', 0, 20, 0.5],
        ['toBrightness', 'Brightness', '%', 0, 200, 1],
        ['toContrast', 'Contrast', '%', 0, 200, 1],
        ['toGrayscale', 'Grayscale', '%', 0, 100, 1],
        ['toHueRotate', 'Hue Rotate', '°', -180, 360, 1],
        ['toInvert', 'Invert', '%', 0, 100, 1],
        ['toOpacity', 'Opacity', '%', 0, 100, 1],
        ['toSaturate', 'Saturate', '%', 0, 300, 1],
        ['toSepia', 'Sepia', '%', 0, 100, 1],
    ],
}

const filterString = (prefix) => {
    const s = settings.value

    return [
        `blur(${s[`${prefix}Blur`]}px)`,
        `brightness(${s[`${prefix}Brightness`]}%)`,
        `contrast(${s[`${prefix}Contrast`]}%)`,
        `grayscale(${s[`${prefix}Grayscale`]}%)`,
        `hue-rotate(${s[`${prefix}HueRotate`]}deg)`,
        `invert(${s[`${prefix}Invert`]}%)`,
        `opacity(${s[`${prefix}Opacity`]}%)`,
        `saturate(${s[`${prefix}Saturate`]}%)`,
        `sepia(${s[`${prefix}Sepia`]}%)`,
    ].join(' ')
}

const iterationValue = computed(() => {
    return settings.value.iterationCount
})

const animationValue = computed(() => {
    const s = settings.value

    return `filterEffect ${s.duration}s ${s.timingFunction} ${s.delay}s ${iterationValue.value} ${s.direction} ${s.fillMode}`
})

const generatedCss = computed(() => {
    const s = settings.value

    return `.filter-animation {
    animation: ${animationValue.value};
}

@keyframes filterEffect {
    from {
        filter: ${filterString('from')};
    }

    to {
        filter: ${filterString('to')};
    }
}`
})

const previewStyle = computed(() => ({
    animation: isPlaying.value
        ? animationValue.value
        : 'none',
}))

const activePresetData = computed(() => {
    return presets.find((preset) => preset.name === activePreset.value)
})

const applyPreset = (preset) => {
    activePreset.value = preset.name
    activeCategory.value = 'Presets'

    settings.value = {
        ...defaultSettings,
        ...preset.values,
    }

    restart()
}

const reset = () => {
    settings.value = { ...defaultSettings }
    activePreset.value = null
    activeCategory.value = 'Presets'
    isPlaying.value = true
    animationKey.value++
    copied.value = false
}

const restart = () => {
    isPlaying.value = false

    requestAnimationFrame(() => {
        animationKey.value++
        isPlaying.value = true
    })
}

const toggleAnimation = () => {
    isPlaying.value = !isPlaying.value
}

const selectCategory = (category) => {
    activeCategory.value = category.name
}

const copyCss = async () => {
    try {
        await navigator.clipboard.writeText(generatedCss.value)

        copied.value = true

        window.setTimeout(() => {
            copied.value = false
        }, 1500)
    } catch {
        copied.value = false
    }
}
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-gray-950 dark:text-gray-100"
    >
        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                <div
                    class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400"
                        >
                            <Sparkles class="h-3.5 w-3.5" />
                            CSS Builder
                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] dark:text-gray-100 sm:text-4xl"
                        >
                            Filter Animation Generator
                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400"
                        >
                            Create animated CSS filter effects with keyframes,
                            presets, timing controls, live preview, and
                            ready-to-use CSS.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="reset"
                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                    >
                        <RotateCcw class="h-4 w-4" />
                        Reset
                    </button>
                </div>
            </div>
        </section>

        <!-- Workspace -->
        <section class="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">
            <div class="grid gap-6 xl:grid-cols-[350px_minmax(0,1fr)]">
                <!-- Sidebar -->
                <aside
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    <!-- Categories -->
                    <div
                        class="border-b border-slate-200 p-3 dark:border-gray-800"
                    >
                        <p
                            class="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                        >
                            Builder
                        </p>

                        <div class="space-y-1">
                            <button
                                v-for="category in categories"
                                :key="category.name"
                                type="button"
                                @click="selectCategory(category)"
                                class="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition"
                                :class="
                                    activeCategory === category.name
                                        ? 'bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400'
                                        : 'text-slate-600 hover:bg-slate-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                "
                            >
                                <div>
                                    <p class="text-xs font-semibold">
                                        {{ category.name }}
                                    </p>

                                    <p
                                        class="mt-0.5 text-[10px]"
                                        :class="
                                            activeCategory === category.name
                                                ? 'text-cyan-600/80 dark:text-cyan-400/80'
                                                : 'text-slate-400 dark:text-gray-500'
                                        "
                                    >
                                        {{ category.description }}
                                    </p>
                                </div>

                                <span
                                    v-if="activeCategory === category.name"
                                    class="h-1.5 w-1.5 rounded-full bg-cyan-500"
                                ></span>
                            </button>
                        </div>
                    </div>

                    <!-- Controls Header -->
                    <div
                        class="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-gray-800"
                    >
                        <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                        >
                            <SlidersHorizontal class="h-5 w-5" />
                        </div>

                        <div>
                            <h2
                                class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                            >
                                Animation Settings
                            </h2>

                            <p
                                class="text-xs text-slate-500 dark:text-gray-400"
                            >
                                Configure your effect
                            </p>
                        </div>
                    </div>

                    <div class="space-y-7 p-5">
                        <!-- Presets -->
                        <div>
                            <div class="mb-3 flex items-center justify-between">
                                <label
                                    class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    Presets
                                </label>

                                <span
                                    v-if="activePreset"
                                    class="text-[10px] font-medium text-cyan-600 dark:text-cyan-400"
                                >
                                    {{ activePreset }}
                                </span>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <button
                                    v-for="preset in presets"
                                    :key="preset.name"
                                    type="button"
                                    @click="applyPreset(preset)"
                                    class="rounded-lg border px-3 py-2.5 text-xs font-medium transition"
                                    :class="
                                        activePreset === preset.name
                                            ? 'border-cyan-400 bg-cyan-50 text-[#167fa8] shadow-sm dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400'
                                    "
                                >
                                    {{ preset.name }}
                                </button>
                            </div>
                        </div>

                        <!-- Animation Settings -->
                        <div class="space-y-5">
                            <label
                                class="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Animation
                            </label>

                            <!-- Duration -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                >
                                    <span>Duration</span>

                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.duration }}s
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.duration"
                                    type="range"
                                    min="0.1"
                                    max="10"
                                    step="0.1"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Delay -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                >
                                    <span>Delay</span>

                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.delay }}s
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.delay"
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Timing -->
                            <div>
                                <label
                                    class="mb-2 block text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Timing Function
                                </label>

                                <select
                                    v-model="settings.timingFunction"
                                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <option value="linear">linear</option>
                                    <option value="ease">ease</option>
                                    <option value="ease-in">ease-in</option>
                                    <option value="ease-out">ease-out</option>
                                    <option value="ease-in-out">
                                        ease-in-out
                                    </option>
                                    <option value="step-start">
                                        step-start
                                    </option>
                                    <option value="step-end">
                                        step-end
                                    </option>
                                </select>
                            </div>

                            <!-- Iterations -->
                            <div>
                                <label
                                    class="mb-2 block text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Iteration Count
                                </label>

                                <select
                                    v-model="settings.iterationCount"
                                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="infinite">
                                        Infinite
                                    </option>
                                </select>
                            </div>

                            <!-- Direction -->
                            <div>
                                <label
                                    class="mb-2 block text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Direction
                                </label>

                                <select
                                    v-model="settings.direction"
                                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="reverse">Reverse</option>
                                    <option value="alternate">
                                        Alternate
                                    </option>
                                    <option value="alternate-reverse">
                                        Alternate Reverse
                                    </option>
                                </select>
                            </div>

                            <!-- Fill -->
                            <div>
                                <label
                                    class="mb-2 block text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Fill Mode
                                </label>

                                <select
                                    v-model="settings.fillMode"
                                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <option value="none">None</option>
                                    <option value="forwards">Forwards</option>
                                    <option value="backwards">
                                        Backwards
                                    </option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                        </div>

                        <!-- From -->
                        <div>
                            <label
                                class="mb-4 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                From State
                            </label>

                            <div class="space-y-4">
                                <div
                                    v-for="item in controlGroups.from"
                                    :key="item[0]"
                                >
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>{{ item[1] }}</span>

                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings[item[0]] }}{{ item[2] }}
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings[item[0]]"
                                        type="range"
                                        :min="item[3]"
                                        :max="item[4]"
                                        :step="item[5]"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- To -->
                        <div>
                            <label
                                class="mb-4 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                To State
                            </label>

                            <div class="space-y-4">
                                <div
                                    v-for="item in controlGroups.to"
                                    :key="item[0]"
                                >
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>{{ item[1] }}</span>

                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings[item[0]] }}{{ item[2] }}
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings[item[0]]"
                                        type="range"
                                        :min="item[3]"
                                        :max="item[4]"
                                        :step="item[5]"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">
                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <Sparkles class="h-5 w-5" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Animation Preview
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Live CSS filter animation
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <button
                                    type="button"
                                    @click="toggleAnimation"
                                    class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                                >
                                    <Pause
                                        v-if="isPlaying"
                                        class="h-3.5 w-3.5"
                                    />

                                    <Play
                                        v-else
                                        class="h-3.5 w-3.5"
                                    />

                                    {{ isPlaying ? 'Pause' : 'Play' }}
                                </button>

                                <button
                                    type="button"
                                    @click="restart"
                                    class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                                >
                                    <RotateCcw class="h-3.5 w-3.5" />
                                    Restart
                                </button>
                            </div>
                        </div>

                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 dark:border-gray-800 dark:bg-gray-950 sm:p-10"
                        >
                            <div
                                class="flex min-h-[430px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white p-10 dark:border-gray-700 dark:bg-gray-900"
                            >
                                <div
                                    :key="animationKey"
                                    class="relative flex h-48 w-48 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-center text-lg font-semibold text-[#17447f] shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300"
                                    :style="previewStyle"
                                >
                                    CSSCraft
                                </div>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div
                            class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-gray-800 sm:grid-cols-4"
                        >
                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Duration
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.duration }}s
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Timing
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.timingFunction }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Iterations
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.iterationCount }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Direction
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.direction }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Current Preset -->
                    <section
                        v-if="activePresetData"
                        class="rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/20"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm dark:bg-gray-900 dark:text-cyan-400"
                            >
                                <Sparkles class="h-4 w-4" />
                            </div>

                            <div>
                                <p
                                    class="text-xs font-semibold text-cyan-800 dark:text-cyan-300"
                                >
                                    {{ activePresetData.name }} preset active
                                </p>

                                <p
                                    class="mt-0.5 text-[11px] text-cyan-700/70 dark:text-cyan-400/70"
                                >
                                    {{ activePresetData.category }} filter
                                    animation
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <Code2 class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Generated CSS
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Ready-to-use animation CSS.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="copyCss"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                            >
                                <Check
                                    v-if="copied"
                                    class="h-3.5 w-3.5 text-emerald-500"
                                />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5"
                                />

                                {{ copied ? 'Copied' : 'Copy CSS' }}
                            </button>
                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"
                        ><code>{{ generatedCss }}</code></pre>
                    </section>

                    <!-- Animation Value -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="border-b border-slate-200 px-5 py-4 dark:border-gray-800"
                        >
                            <h2
                                class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                            >
                                Animation Value
                            </h2>

                            <p
                                class="mt-1 text-xs text-slate-500 dark:text-gray-400"
                            >
                                The generated animation property.
                            </p>
                        </div>

                        <div class="p-5">
                            <code
                                class="block overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-cyan-300"
                            >
                                animation: {{ animationValue }};
                            </code>
                        </div>
                    </section>

                    <!-- Filter States -->
                    <section
                        class="grid gap-6 md:grid-cols-2"
                    >
                        <div
                            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            >
                                From Filter
                            </p>

                            <code
                                class="mt-3 block overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-cyan-300"
                            >
                                filter: {{ filterString('from') }};
                            </code>
                        </div>

                        <div
                            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            >
                                To Filter
                            </p>

                            <code
                                class="mt-3 block overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-cyan-300"
                            >
                                filter: {{ filterString('to') }};
                            </code>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    </main>
</template>