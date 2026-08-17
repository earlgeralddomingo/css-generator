<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
    Square,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('controls')

const settings = ref({
    type: 'linear',
    angle: 90,
    fadeStart: 0,
    fadeEnd: 100,

    radialShape: 'circle',
    positionX: 50,
    positionY: 50,
    radialSizeX: 50,
    radialSizeY: 50,

    invert: false,
    maskSize: 100,
})

const defaultSettings = {
    type: 'linear',
    angle: 90,
    fadeStart: 0,
    fadeEnd: 100,

    radialShape: 'circle',
    positionX: 50,
    positionY: 50,
    radialSizeX: 50,
    radialSizeY: 50,

    invert: false,
    maskSize: 100,
}

const presets = [
    {
        name: 'Fade Down',
        settings: {
            type: 'linear',
            angle: 180,
            fadeStart: 0,
            fadeEnd: 100,
        },
    },
    {
        name: 'Fade Up',
        settings: {
            type: 'linear',
            angle: 0,
            fadeStart: 0,
            fadeEnd: 100,
        },
    },
    {
        name: 'Fade Left',
        settings: {
            type: 'linear',
            angle: 270,
            fadeStart: 0,
            fadeEnd: 100,
        },
    },
    {
        name: 'Fade Right',
        settings: {
            type: 'linear',
            angle: 90,
            fadeStart: 0,
            fadeEnd: 100,
        },
    },
    {
        name: 'Radial',
        settings: {
            type: 'radial',
            radialShape: 'circle',
            positionX: 50,
            positionY: 50,
            radialSizeX: 50,
            radialSizeY: 50,
            fadeStart: 0,
            fadeEnd: 100,
        },
    },
    {
        name: 'Spotlight',
        settings: {
            type: 'radial',
            radialShape: 'circle',
            positionX: 50,
            positionY: 50,
            radialSizeX: 30,
            radialSizeY: 30,
            fadeStart: 0,
            fadeEnd: 100,
        },
    },
]

const normalizedStops = computed(() => {
    const start = Math.min(
        Number(settings.value.fadeStart),
        Number(settings.value.fadeEnd)
    )

    const end = Math.max(
        Number(settings.value.fadeStart),
        Number(settings.value.fadeEnd)
    )

    return {
        start,
        end,
    }
})

const maskColorStops = computed(() => {
    const { start, end } = normalizedStops.value

    if (settings.value.invert) {
        return `transparent ${start}%, black ${end}%`
    }

    return `black ${start}%, transparent ${end}%`
})

const compactMaskValue = computed(() => {
    const s = settings.value
    const stops = maskColorStops.value

    if (s.type === 'radial') {
        if (s.radialShape === 'ellipse') {
            return `radial-gradient(ellipse ${s.radialSizeX}% ${s.radialSizeY}% at ${s.positionX}% ${s.positionY}%, ${stops})`
        }

        return `radial-gradient(circle ${s.radialSizeX}% at ${s.positionX}% ${s.positionY}%, ${stops})`
    }

    return `linear-gradient(${s.angle}deg, ${stops})`
})

const previewStyle = computed(() => ({
    WebkitMaskImage: compactMaskValue.value,
    maskImage: compactMaskValue.value,
    WebkitMaskSize: `${settings.value.maskSize}% ${settings.value.maskSize}%`,
    maskSize: `${settings.value.maskSize}% ${settings.value.maskSize}%`,
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
}))

const generatedCss = computed(() => {
    return `.mask-preview {
    -webkit-mask-image: ${compactMaskValue.value};
    mask-image: ${compactMaskValue.value};
    -webkit-mask-size: ${settings.value.maskSize}% ${settings.value.maskSize}%;
    mask-size: ${settings.value.maskSize}% ${settings.value.maskSize}%;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}`
})

const generatedHtml = computed(() => {
    return `<div class="mask-preview">
    CSSCraft
</div>`
})

const completeCode = computed(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSSCraft Mask</title>

    <style>
        .mask-preview {
            width: 360px;
            height: 240px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #17447f;
            color: white;

            font-family: Arial, sans-serif;
            font-weight: 700;
            font-size: 24px;

            -webkit-mask-image: ${compactMaskValue.value};
            mask-image: ${compactMaskValue.value};

            -webkit-mask-size: ${settings.value.maskSize}% ${settings.value.maskSize}%;
            mask-size: ${settings.value.maskSize}% ${settings.value.maskSize}%;

            -webkit-mask-position: center;
            mask-position: center;

            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
        }
    </style>
</head>

<body>

    ${generatedHtml.value}

</body>
</html>`
})

const maskLabel = computed(() => {
    if (settings.value.type === 'linear') {
        return 'Linear Gradient Mask'
    }

    return settings.value.radialShape === 'ellipse'
        ? 'Radial Ellipse Mask'
        : 'Radial Circle Mask'
})

const maskDescription = computed(() => {
    if (settings.value.type === 'linear') {
        return 'A directional gradient controls the visible area of the element.'
    }

    return 'A radial gradient controls visibility from a selected position.'
})

const maskTypeLabel = computed(() => {
    if (settings.value.type === 'linear') {
        return 'Linear'
    }

    return settings.value.radialShape === 'ellipse'
        ? 'Radial Ellipse'
        : 'Radial Circle'
})

const angleLabel = computed(() => {
    const angle = Number(settings.value.angle)

    if (angle === 0) return 'Up'
    if (angle === 90) return 'Right'
    if (angle === 180) return 'Down'
    if (angle === 270) return 'Left'

    return `${angle}°`
})

const applyPreset = (preset) => {
    settings.value = {
        ...settings.value,
        ...preset.settings,
    }
}

const reset = () => {
    settings.value = { ...defaultSettings }
    activeTab.value = 'controls'
    copied.value = ''
}

const copyText = async (value, type) => {
    try {
        await navigator.clipboard.writeText(value)

        copied.value = type

        window.setTimeout(() => {
            if (copied.value === type) {
                copied.value = ''
            }
        }, 1500)
    } catch {
        copied.value = ''
    }
}

const exportHtml = () => {
    const blob = new Blob([completeCode.value], {
        type: 'text/html;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'masking-generator.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">

        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">

                <div
                    class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400">

                            <Sparkles class="h-3.5 w-3.5" />

                            CSS Builder

                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] dark:text-gray-100 sm:text-4xl">

                            Masking Generator

                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400">

                            Create CSS masks with linear and radial gradients,
                            adjust visibility, positioning and size, then export
                            clean ready-to-use CSS.

                        </p>

                    </div>

                    <div class="flex flex-wrap gap-3">

                        <button
                            type="button"
                            @click="reset"
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">

                            <RotateCcw class="h-4 w-4" />

                            Reset

                        </button>

                        <button
                            type="button"
                            @click="exportHtml"
                            class="inline-flex items-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123968]">

                            <Download class="h-4 w-4" />

                            Export HTML

                        </button>

                    </div>

                </div>

            </div>
        </section>

        <!-- Workspace -->
        <section class="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">

            <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">

                <!-- Sidebar -->
                <aside
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

                    <!-- Tabs -->
                    <div
                        class="grid grid-cols-2 border-b border-slate-200 dark:border-gray-800">

                        <button
                            type="button"
                            @click="activeTab = 'controls'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'controls'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            ]">

                            <SlidersHorizontal class="h-3.5 w-3.5" />

                            Controls

                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'css'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'css'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            ]">

                            <Code2 class="h-3.5 w-3.5" />

                            CSS

                        </button>

                    </div>

                    <!-- Controls -->
                    <div
                        v-if="activeTab === 'controls'"
                        class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <SlidersHorizontal class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                    Mask Settings

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">

                                    Configure your CSS mask

                                </p>

                            </div>

                        </div>

                        <!-- Type -->
                        <div>

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Mask Type

                            </label>

                            <select
                                v-model="settings.type"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                <option value="linear">
                                    Linear Gradient
                                </option>

                                <option value="radial">
                                    Radial Gradient
                                </option>

                            </select>

                        </div>

                        <!-- Linear -->
                        <template v-if="settings.type === 'linear'">

                            <div class="mt-6">

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    <span>Angle</span>

                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400">

                                        {{ settings.angle }}°

                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.angle"
                                    type="range"
                                    min="0"
                                    max="360"
                                    class="w-full accent-cyan-500" />

                                <div
                                    class="mt-2 flex justify-between text-[10px] text-slate-400 dark:text-gray-500">

                                    <span>0°</span>
                                    <span>90°</span>
                                    <span>180°</span>
                                    <span>270°</span>
                                    <span>360°</span>

                                </div>

                            </div>

                        </template>

                        <!-- Radial -->
                        <template v-else>

                            <div class="mt-6">

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    Shape

                                </label>

                                <select
                                    v-model="settings.radialShape"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                    <option value="circle">
                                        Circle
                                    </option>

                                    <option value="ellipse">
                                        Ellipse
                                    </option>

                                </select>

                            </div>

                            <div class="mt-6">

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    <span>Position X</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.positionX }}%
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.positionX"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-cyan-500" />

                            </div>

                            <div class="mt-6">

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    <span>Position Y</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.positionY }}%
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.positionY"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-cyan-500" />

                            </div>

                            <div class="mt-6">

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    <span>
                                        {{ settings.radialShape === 'ellipse'
                                            ? 'Radius X'
                                            : 'Radius'
                                        }}
                                    </span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.radialSizeX }}%
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.radialSizeX"
                                    type="range"
                                    min="5"
                                    max="100"
                                    class="w-full accent-cyan-500" />

                            </div>

                            <div
                                v-if="settings.radialShape === 'ellipse'"
                                class="mt-6">

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    <span>Radius Y</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.radialSizeY }}%
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.radialSizeY"
                                    type="range"
                                    min="5"
                                    max="100"
                                    class="w-full accent-cyan-500" />

                            </div>

                        </template>

                        <!-- Fade Start -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Visible Start</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.fadeStart }}%
                                </span>

                            </label>

                            <input
                                v-model.number="settings.fadeStart"
                                type="range"
                                min="0"
                                max="100"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Fade End -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Fade End</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.fadeEnd }}%
                                </span>

                            </label>

                            <input
                                v-model.number="settings.fadeEnd"
                                type="range"
                                min="0"
                                max="100"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Mask Size -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Mask Size</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.maskSize }}%
                                </span>

                            </label>

                            <input
                                v-model.number="settings.maskSize"
                                type="range"
                                min="25"
                                max="200"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Invert -->
                        <div
                            class="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800">

                            <div>

                                <p
                                    class="text-xs font-semibold text-[#10233f] dark:text-gray-100">

                                    Invert Mask

                                </p>

                                <p
                                    class="mt-1 text-[10px] leading-4 text-slate-500 dark:text-gray-400">

                                    Reverse visible and hidden areas.

                                </p>

                            </div>

                            <button
                                type="button"
                                @click="settings.invert = !settings.invert"
                                :class="[
                                    'relative h-6 w-11 rounded-full transition',
                                    settings.invert
                                        ? 'bg-cyan-500'
                                        : 'bg-slate-300 dark:bg-gray-600'
                                ]">

                                <span
                                    :class="[
                                        'absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition',
                                        settings.invert
                                            ? 'left-6'
                                            : 'left-1'
                                    ]">
                                </span>

                            </button>

                        </div>

                        <!-- Presets -->
                        <div class="mt-6">

                            <p
                                class="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Presets

                            </p>

                            <div class="grid grid-cols-2 gap-2">

                                <button
                                    v-for="preset in presets"
                                    :key="preset.name"
                                    type="button"
                                    @click="applyPreset(preset)"
                                    class="rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-400">

                                    {{ preset.name }}

                                </button>

                            </div>

                        </div>

                        <!-- Current Value -->
                        <div
                            class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800">

                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                Mask Image

                            </p>

                            <p
                                class="mt-2 break-all font-mono text-xs leading-5 text-[#10233f] dark:text-gray-200">

                                {{ compactMaskValue }}

                            </p>

                        </div>

                    </div>

                    <!-- CSS Tab -->
                    <div v-else class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <Code2 class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                    Generated CSS

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">

                                    Based on your mask settings

                                </p>

                            </div>

                        </div>

                        <pre
                            class="overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                        <button
                            type="button"
                            @click="copyText(generatedCss, 'css')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968]">

                            <Check
                                v-if="copied === 'css'"
                                class="h-4 w-4" />

                            <Copy
                                v-else
                                class="h-4 w-4" />

                            {{ copied === 'css'
                                ? 'Copied'
                                : 'Copy CSS'
                            }}

                        </button>

                    </div>

                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">

                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <Square class="h-5 w-5" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Mask Editor

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        {{ maskLabel }}
                                    </p>

                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    {{ maskTypeLabel }}

                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">

                                    <span
                                        class="h-1.5 w-1.5 rounded-full bg-emerald-500">
                                    </span>

                                    Live

                                </span>

                            </div>

                        </div>

                        <!-- Preview Body -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 dark:border-gray-800 dark:bg-gray-950 sm:p-10">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p
                                            class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">

                                            Visual Mask Editor

                                        </p>

                                        <p
                                            class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-200/70">

                                            {{ maskDescription }}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <!-- Checkerboard -->
                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">

                                <div
                                    class="flex min-h-[430px] items-center justify-center overflow-auto rounded-lg border border-slate-200 p-10 dark:border-gray-700"
                                    style="
                                        background-color: #f8fafc;
                                        background-image:
                                            linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
                                            linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
                                            linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
                                            linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
                                        background-size: 24px 24px;
                                        background-position: 0 0, 0 12px, 12px -12px, -12px 0;
                                    ">

                                    <div
                                        class="flex h-[240px] w-[360px] items-center justify-center rounded-xl bg-[#17447f] text-white shadow-xl transition-all duration-200"
                                        :style="previewStyle">

                                        <div class="text-center">

                                            <p class="text-2xl font-bold">
                                                CSSCraft
                                            </p>

                                            <p class="mt-1 text-sm text-white/70">
                                                {{ maskLabel }}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Properties -->
                        <div
                            class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-gray-800 sm:grid-cols-4">

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Type

                                </p>

                                <p
                                    class="mt-1 truncate text-xs font-semibold text-[#10233f] dark:text-gray-100">

                                    {{ maskTypeLabel }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Angle

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-100">

                                    {{ settings.type === 'linear'
                                        ? angleLabel
                                        : 'N/A'
                                    }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Fade

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-100">

                                    {{ settings.fadeStart }}% →
                                    {{ settings.fadeEnd }}%

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Status

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">

                                    Active

                                </p>

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

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Generated CSS

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">

                                        Ready-to-use masking CSS.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedCss, 'generated-css')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check
                                    v-if="copied === 'generated-css'"
                                    class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5" />

                                {{ copied === 'generated-css'
                                    ? 'Copied'
                                    : 'Copy CSS'
                                }}

                            </button>

                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                    </section>

                    <!-- Generated HTML -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300">

                                    <FileCode2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Generated HTML

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">

                                        HTML structure for the mask.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedHtml, 'html')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check
                                    v-if="copied === 'html'"
                                    class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5" />

                                {{ copied === 'html'
                                    ? 'Copied'
                                    : 'Copy HTML'
                                }}

                            </button>

                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedHtml }}</code></pre>

                    </section>

                    <!-- Complete Code -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <FileCode2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Complete Code

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">

                                        Ready-to-use HTML and CSS.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(completeCode, 'complete')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17447f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#123968]">

                                <Check
                                    v-if="copied === 'complete'"
                                    class="h-3.5 w-3.5" />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5" />

                                {{ copied === 'complete'
                                    ? 'Copied'
                                    : 'Copy Complete Code'
                                }}

                            </button>

                        </div>

                        <pre
                            class="max-h-[600px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ completeCode }}</code></pre>

                    </section>

                </div>

            </div>

        </section>

    </main>
</template>