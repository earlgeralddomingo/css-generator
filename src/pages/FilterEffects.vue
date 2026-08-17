<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
    Image as ImageIcon,
    Type,
    Layers3,
} from 'lucide-vue-next'

const copied = ref(false)
const copiedValue = ref(false)
const previewMode = ref('card')

const settings = ref({
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
    saturate: 100,
    sepia: 0,
})

const defaultSettings = {
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
    saturate: 100,
    sepia: 0,
}

const presets = [
    {
        name: 'Original',
        values: { ...defaultSettings },
    },
    {
        name: 'Grayscale',
        values: {
            ...defaultSettings,
            grayscale: 100,
        },
    },
    {
        name: 'Vintage',
        values: {
            ...defaultSettings,
            sepia: 45,
            contrast: 90,
            brightness: 95,
            saturate: 80,
        },
    },
    {
        name: 'Dramatic',
        values: {
            ...defaultSettings,
            contrast: 150,
            brightness: 90,
            saturate: 125,
        },
    },
    {
        name: 'Warm',
        values: {
            ...defaultSettings,
            sepia: 25,
            saturate: 125,
            hueRotate: -10,
            brightness: 105,
        },
    },
    {
        name: 'Cool',
        values: {
            ...defaultSettings,
            hueRotate: 25,
            saturate: 115,
            brightness: 105,
            contrast: 105,
        },
    },
    {
        name: 'Noir',
        values: {
            ...defaultSettings,
            grayscale: 100,
            contrast: 135,
            brightness: 85,
        },
    },
    {
        name: 'Faded',
        values: {
            ...defaultSettings,
            brightness: 110,
            contrast: 75,
            saturate: 65,
            opacity: 90,
        },
    },
]

const filterDefinitions = [
    {
        key: 'blur',
        label: 'Blur',
        min: 0,
        max: 20,
        step: 0.5,
        unit: 'px',
    },
    {
        key: 'brightness',
        label: 'Brightness',
        min: 0,
        max: 200,
        step: 1,
        unit: '%',
    },
    {
        key: 'contrast',
        label: 'Contrast',
        min: 0,
        max: 200,
        step: 1,
        unit: '%',
    },
    {
        key: 'grayscale',
        label: 'Grayscale',
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
    },
    {
        key: 'hueRotate',
        label: 'Hue Rotate',
        min: -180,
        max: 180,
        step: 1,
        unit: '°',
    },
    {
        key: 'invert',
        label: 'Invert',
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
    },
    {
        key: 'opacity',
        label: 'Opacity',
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
    },
    {
        key: 'saturate',
        label: 'Saturation',
        min: 0,
        max: 300,
        step: 1,
        unit: '%',
    },
    {
        key: 'sepia',
        label: 'Sepia',
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
    },
]

const filterValue = computed(() => {
    const s = settings.value

    return [
        `blur(${s.blur}px)`,
        `brightness(${s.brightness}%)`,
        `contrast(${s.contrast}%)`,
        `grayscale(${s.grayscale}%)`,
        `hue-rotate(${s.hueRotate}deg)`,
        `invert(${s.invert}%)`,
        `opacity(${s.opacity}%)`,
        `saturate(${s.saturate}%)`,
        `sepia(${s.sepia}%)`,
    ].join(' ')
})

const generatedCss = computed(() => {
    return `.filter-element {
    filter: ${filterValue.value};
}`
})

const previewStyle = computed(() => ({
    filter: filterValue.value,
}))

const activeFilterCount = computed(() => {
    const s = settings.value

    return [
        s.blur !== 0,
        s.brightness !== 100,
        s.contrast !== 100,
        s.grayscale !== 0,
        s.hueRotate !== 0,
        s.invert !== 0,
        s.opacity !== 100,
        s.saturate !== 100,
        s.sepia !== 0,
    ].filter(Boolean).length
})

const reset = () => {
    settings.value = { ...defaultSettings }
    copied.value = false
    copiedValue.value = false
}

const resetFilter = (key) => {
    const definition = filterDefinitions.find(
        (filter) => filter.key === key,
    )

    if (!definition) return

    const defaults = {
        blur: 0,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        hueRotate: 0,
        invert: 0,
        opacity: 100,
        saturate: 100,
        sepia: 0,
    }

    settings.value[key] = defaults[key]
}

const applyPreset = (preset) => {
    settings.value = { ...preset.values }
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

const copyFilterValue = async () => {
    try {
        await navigator.clipboard.writeText(filterValue.value)

        copiedValue.value = true

        window.setTimeout(() => {
            copiedValue.value = false
        }, 1500)
    } catch {
        copiedValue.value = false
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
                            Filter Effects Generator
                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400"
                        >
                            Build CSS filter effects visually with live
                            previews, presets, detailed controls and
                            ready-to-use CSS.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="reset"
                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <RotateCcw class="h-4 w-4" />
                        Reset All
                    </button>
                </div>
            </div>
        </section>

        <!-- Workspace -->
        <section class="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">
            <div class="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <!-- Controls -->
                <aside
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    <div
                        class="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-gray-800"
                    >
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                        >
                            <SlidersHorizontal class="h-5 w-5" />
                        </div>

                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                >
                                    Filter Settings
                                </h2>

                                <span
                                    v-if="activeFilterCount"
                                    class="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400"
                                >
                                    {{ activeFilterCount }} active
                                </span>
                            </div>

                            <p
                                class="text-xs text-slate-500 dark:text-gray-400"
                            >
                                Fine-tune each CSS filter
                            </p>
                        </div>
                    </div>

                    <div class="space-y-6 p-5">
                        <div
                            v-for="filter in filterDefinitions"
                            :key="filter.key"
                        >
                            <div class="mb-2 flex items-center justify-between">
                                <label
                                    class="text-xs font-medium text-slate-600 dark:text-gray-300"
                                >
                                    {{ filter.label }}
                                </label>

                                <div class="flex items-center gap-2">
                                    <span
                                        class="font-mono text-xs text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings[filter.key] }}{{ filter.unit }}
                                    </span>

                                    <button
                                        type="button"
                                        @click="resetFilter(filter.key)"
                                        class="text-slate-400 transition hover:text-[#167fa8] dark:hover:text-cyan-400"
                                        title="Reset filter"
                                    >
                                        <RotateCcw class="h-3 w-3" />
                                    </button>
                                </div>
                            </div>

                            <input
                                v-model.number="settings[filter.key]"
                                type="range"
                                :min="filter.min"
                                :max="filter.max"
                                :step="filter.step"
                                class="w-full accent-cyan-500"
                            />
                        </div>
                    </div>
                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">
                    <!-- Presets -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="border-b border-slate-200 px-5 py-4 dark:border-gray-800"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <Sparkles class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Quick Presets
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Start with a predefined effect
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="flex gap-2 overflow-x-auto p-4 scrollbar-thin"
                        >
                            <button
                                v-for="preset in presets"
                                :key="preset.name"
                                type="button"
                                @click="applyPreset(preset)"
                                class="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                            >
                                {{ preset.name }}
                            </button>
                        </div>
                    </section>

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
                                        Filter Preview
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Changes are applied instantly
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <button
                                    type="button"
                                    @click="previewMode = 'card'"
                                    :class="
                                        previewMode === 'card'
                                            ? 'bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'text-slate-500 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                    "
                                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
                                >
                                    <Layers3 class="h-3.5 w-3.5" />
                                    Card
                                </button>

                                <button
                                    type="button"
                                    @click="previewMode = 'text'"
                                    :class="
                                        previewMode === 'text'
                                            ? 'bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'text-slate-500 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                    "
                                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
                                >
                                    <Type class="h-3.5 w-3.5" />
                                    Text
                                </button>
                            </div>
                        </div>

                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 dark:border-gray-800 dark:bg-gray-950 sm:p-10"
                        >
                            <div
                                class="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white p-10 dark:border-gray-700 dark:bg-gray-900"
                            >
                                <div
                                    v-if="previewMode === 'card'"
                                    class="relative flex h-48 w-48 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-center text-lg font-bold text-[#17447f] shadow-lg transition-none dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300"
                                    :style="previewStyle"
                                >
                                    CSSCraft
                                </div>

                                <div
                                    v-else
                                    class="text-center text-7xl font-black tracking-tight text-cyan-600 dark:text-cyan-400"
                                    :style="previewStyle"
                                >
                                    CSS
                                </div>
                            </div>
                        </div>

                        <div
                            class="grid grid-cols-2 divide-x divide-y divide-slate-200 dark:divide-gray-800 sm:grid-cols-4 sm:divide-y-0"
                        >
                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Blur
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.blur }}px
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Brightness
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.brightness }}%
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Contrast
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.contrast }}%
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Saturation
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.saturate }}%
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
                                        Ready-to-use filter CSS.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="copyCss"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
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

                    <!-- Filter Value -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
                        >
                            <div>
                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                >
                                    Filter Value
                                </h2>

                                <p
                                    class="mt-1 text-xs text-slate-500 dark:text-gray-400"
                                >
                                    The generated filter property.
                                </p>
                            </div>

                            <button
                                type="button"
                                @click="copyFilterValue"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                            >
                                <Check
                                    v-if="copiedValue"
                                    class="h-3.5 w-3.5 text-emerald-500"
                                />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5"
                                />

                                {{ copiedValue ? 'Copied' : 'Copy Value' }}
                            </button>
                        </div>

                        <div class="p-5">
                            <code
                                class="block overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-cyan-300"
                            >
                                filter: {{ filterValue }};
                            </code>
                        </div>
                    </section>

                    <!-- Filter Summary -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-gray-800"
                        >
                            <div
                                class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                            >
                                <ImageIcon class="h-4 w-4" />
                            </div>

                            <div>
                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                >
                                    Filter Summary
                                </h2>

                                <p
                                    class="text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Current filter configuration
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-px bg-slate-200 dark:bg-gray-800 sm:grid-cols-3">
                            <div
                                v-for="filter in filterDefinitions"
                                :key="filter.key"
                                class="bg-white p-4 dark:bg-gray-900"
                            >
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    {{ filter.label }}
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#167fa8] dark:text-cyan-400"
                                >
                                    {{ settings[filter.key] }}{{ filter.unit }}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    </main>
</template>