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
    shape: 'polygon',
    topLeftX: 10,
    topLeftY: 10,
    topRightX: 90,
    topRightY: 10,
    bottomRightX: 90,
    bottomRightY: 90,
    bottomLeftX: 10,
    bottomLeftY: 90,

    insetTop: 10,
    insetRight: 10,
    insetBottom: 10,
    insetLeft: 10,

    circleX: 50,
    circleY: 50,
    circleRadius: 50,

    ellipseX: 50,
    ellipseY: 50,
    ellipseRadiusX: 50,
    ellipseRadiusY: 40,
})

const defaultSettings = { ...settings.value }

const clipPathValue = computed(() => {
    const s = settings.value

    switch (s.shape) {
        case 'inset':
            return `inset(${s.insetTop}% ${s.insetRight}% ${s.insetBottom}% ${s.insetLeft}%)`

        case 'circle':
            return `circle(${s.circleRadius}% at ${s.circleX}% ${s.circleY}%)`

        case 'ellipse':
            return `ellipse(${s.ellipseRadiusX}% ${s.ellipseRadiusY}% at ${s.ellipseX}% ${s.ellipseY}%)`

        case 'triangle':
            return 'polygon(50% 0%, 100% 100%, 0% 100%)'

        case 'diamond':
            return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'

        case 'hexagon':
            return 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)'

        case 'parallelogram':
            return 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'

        case 'polygon':
        default:
            return `polygon(
    ${s.topLeftX}% ${s.topLeftY}%,
    ${s.topRightX}% ${s.topRightY}%,
    ${s.bottomRightX}% ${s.bottomRightY}%,
    ${s.bottomLeftX}% ${s.bottomLeftY}%
)`
    }
})

const previewStyle = computed(() => ({
    clipPath: clipPathValue.value,
}))

const generatedCss = computed(() => {
    return `.clip-preview {
    clip-path: ${clipPathValue.value};
}`
})

const generatedHtml = computed(() => {
    return `<div class="clip-preview">
    CSSCraft
</div>`
})

const completeCode = computed(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clip Path</title>

    <style>
        .clip-preview {
            width: 360px;
            height: 240px;
            background: #17447f;
            clip-path: ${clipPathValue.value};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 24px;
            font-weight: 700;
        }
    </style>
</head>

<body>

    ${generatedHtml.value}

</body>
</html>`
})

const shapeLabel = computed(() => {
    const labels = {
        polygon: 'Custom Polygon',
        inset: 'Inset',
        circle: 'Circle',
        ellipse: 'Ellipse',
        triangle: 'Triangle',
        diamond: 'Diamond',
        hexagon: 'Hexagon',
        parallelogram: 'Parallelogram',
    }

    return labels[settings.value.shape]
})

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
    link.download = 'clip-path-generator.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors duration-300 dark:bg-[#0b1120] dark:text-slate-100">

        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-[#0f172a]">

            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">

                <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-400">

                            <Sparkles class="h-3.5 w-3.5" />

                            CSS Builder

                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] transition-colors sm:text-4xl dark:text-slate-100">

                            Clip Path Generator

                        </h1>

                        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">

                            Create custom CSS clipping shapes visually and generate
                            clean clip-path CSS instantly.

                        </p>

                    </div>

                    <div class="flex flex-wrap gap-3">

                        <button type="button" @click="reset"
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">

                            <RotateCcw class="h-4 w-4" />

                            Reset

                        </button>

                        <button type="button" @click="exportHtml"
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
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-[#0f172a]">

                    <!-- Tabs -->
                    <div class="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800">

                        <button type="button" @click="activeTab = 'controls'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'controls'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
                        ]">

                            <SlidersHorizontal class="h-3.5 w-3.5" />

                            Controls

                        </button>

                        <button type="button" @click="activeTab = 'css'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'css'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
                        ]">

                            <Code2 class="h-3.5 w-3.5" />

                            CSS

                        </button>

                    </div>

                    <!-- Controls -->
                    <div v-if="activeTab === 'controls'" class="max-h-[calc(100vh-180px)] overflow-y-auto p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <SlidersHorizontal class="h-5 w-5" />

                            </div>

                            <div>

                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                    Clip Path Settings

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">

                                    Configure your clipping shape

                                </p>

                            </div>

                        </div>

                        <!-- Shape -->
                        <div>

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                Shape

                            </label>

                            <select v-model="settings.shape"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                <option value="polygon">
                                    Custom Polygon
                                </option>

                                <option value="inset">
                                    Inset
                                </option>

                                <option value="circle">
                                    Circle
                                </option>

                                <option value="ellipse">
                                    Ellipse
                                </option>

                                <option value="triangle">
                                    Triangle
                                </option>

                                <option value="diamond">
                                    Diamond
                                </option>

                                <option value="hexagon">
                                    Hexagon
                                </option>

                                <option value="parallelogram">
                                    Parallelogram
                                </option>

                            </select>

                        </div>

                        <!-- Polygon -->
                        <div v-if="settings.shape === 'polygon'" class="mt-6 space-y-6">

                            <div>
                                <p
                                    class="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Top Left Point
                                </p>

                                <div class="space-y-4">

                                    <div>
                                        <label
                                            class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <span>X</span>
                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ settings.topLeftX }}%
                                            </span>
                                        </label>

                                        <input v-model.number="settings.topLeftX" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />
                                    </div>

                                    <div>
                                        <label
                                            class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <span>Y</span>
                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ settings.topLeftY }}%
                                            </span>
                                        </label>

                                        <input v-model.number="settings.topLeftY" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />
                                    </div>

                                </div>
                            </div>

                            <div>
                                <p
                                    class="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Top Right Point
                                </p>

                                <div class="space-y-4">

                                    <div>
                                        <label
                                            class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <span>X</span>
                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ settings.topRightX }}%
                                            </span>
                                        </label>

                                        <input v-model.number="settings.topRightX" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />
                                    </div>

                                    <div>
                                        <label
                                            class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <span>Y</span>
                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ settings.topRightY }}%
                                            </span>
                                        </label>

                                        <input v-model.number="settings.topRightY" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />
                                    </div>

                                </div>
                            </div>

                            <div>
                                <p
                                    class="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Bottom Right Point
                                </p>

                                <div class="space-y-4">

                                    <div>
                                        <label
                                            class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <span>X</span>
                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ settings.bottomRightX }}%
                                            </span>
                                        </label>

                                        <input v-model.number="settings.bottomRightX" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />
                                    </div>

                                    <div>
                                        <label
                                            class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <span>Y</span>
                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ settings.bottomRightY }}%
                                            </span>
                                        </label>

                                        <input v-model.number="settings.bottomRightY" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />
                                    </div>

                                </div>
                            </div>

                            <div>
                                <p
                                    class="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Bottom Left Point
                                </p>

                                <div class="space-y-4">

                                    <div>
                                        <label
                                            class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <span>X</span>
                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ settings.bottomLeftX }}%
                                            </span>
                                        </label>

                                        <input v-model.number="settings.bottomLeftX" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />
                                    </div>

                                    <div>
                                        <label
                                            class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <span>Y</span>
                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ settings.bottomLeftY }}%
                                            </span>
                                        </label>

                                        <input v-model.number="settings.bottomLeftY" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />
                                    </div>

                                </div>
                            </div>

                        </div>

                        <!-- Inset -->
                        <div v-if="settings.shape === 'inset'" class="mt-6 space-y-5">

                            <div v-for="item in [
                                ['insetTop', 'Top'],
                                ['insetRight', 'Right'],
                                ['insetBottom', 'Bottom'],
                                ['insetLeft', 'Left']
                            ]" :key="item[0]">

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>{{ item[1] }}</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings[item[0]] }}%
                                    </span>

                                </label>

                                <input v-model.number="settings[item[0]]" type="range" min="0" max="45"
                                    class="w-full accent-cyan-500" />

                            </div>

                        </div>

                        <!-- Circle -->
                        <div v-if="settings.shape === 'circle'" class="mt-6 space-y-5">

                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>Radius</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.circleRadius }}%
                                    </span>

                                </label>

                                <input v-model.number="settings.circleRadius" type="range" min="5" max="75"
                                    class="w-full accent-cyan-500" />
                            </div>

                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>X Position</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.circleX }}%
                                    </span>

                                </label>

                                <input v-model.number="settings.circleX" type="range" min="0" max="100"
                                    class="w-full accent-cyan-500" />
                            </div>

                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>Y Position</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.circleY }}%
                                    </span>

                                </label>

                                <input v-model.number="settings.circleY" type="range" min="0" max="100"
                                    class="w-full accent-cyan-500" />
                            </div>

                        </div>

                        <!-- Ellipse -->
                        <div v-if="settings.shape === 'ellipse'" class="mt-6 space-y-5">

                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>Radius X</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.ellipseRadiusX }}%
                                    </span>

                                </label>

                                <input v-model.number="settings.ellipseRadiusX" type="range" min="5" max="75"
                                    class="w-full accent-cyan-500" />
                            </div>

                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>Radius Y</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.ellipseRadiusY }}%
                                    </span>

                                </label>

                                <input v-model.number="settings.ellipseRadiusY" type="range" min="5" max="75"
                                    class="w-full accent-cyan-500" />
                            </div>

                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>X Position</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.ellipseX }}%
                                    </span>

                                </label>

                                <input v-model.number="settings.ellipseX" type="range" min="0" max="100"
                                    class="w-full accent-cyan-500" />
                            </div>

                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>Y Position</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.ellipseY }}%
                                    </span>

                                </label>

                                <input v-model.number="settings.ellipseY" type="range" min="0" max="100"
                                    class="w-full accent-cyan-500" />
                            </div>

                        </div>

                        <!-- Preset -->
                        <div v-if="['triangle', 'diamond', 'hexagon', 'parallelogram'].includes(settings.shape)"
                            class="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900/70 dark:bg-cyan-950/30">

                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-[#167fa8] dark:text-cyan-400">

                                Preset Shape

                            </p>

                            <p class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-300/80">

                                {{ shapeLabel }} uses a predefined polygon for quick
                                shape creation.

                            </p>

                        </div>

                        <!-- Current Value -->
                        <div
                            class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">

                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">

                                Clip Path

                            </p>

                            <p class="mt-2 break-all font-mono text-xs leading-5 text-[#10233f] dark:text-slate-200">

                                {{ clipPathValue }}

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

                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                    Generated CSS

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">

                                    Based on your clip-path settings

                                </p>

                            </div>

                        </div>

                        <pre
                            class="overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                        <button type="button" @click="copyText(generatedCss, 'css')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968]">

                            <Check v-if="copied === 'css'" class="h-4 w-4" />

                            <Copy v-else class="h-4 w-4" />

                            {{ copied === 'css' ? 'Copied' : 'Copy CSS' }}

                        </button>

                    </div>

                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">

                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-[#0f172a]">

                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <Square class="h-5 w-5" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                        Clip Path Editor

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">

                                        {{ shapeLabel }}

                                    </p>

                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    Clip Path

                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">

                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500">
                                    </span>

                                    Live

                                </span>

                            </div>

                        </div>

                        <!-- Preview Body -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 sm:p-10 dark:border-slate-800 dark:bg-[#0b1120]">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/70 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">

                                            Visual Clip Path Editor

                                        </p>

                                        <p class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-300/80">

                                            Select a shape and adjust its controls to
                                            see the clipping effect update instantly.

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">

                                <div class="flex min-h-[430px] items-center justify-center overflow-auto rounded-lg border border-slate-200 p-12 dark:border-slate-700"
                                    style="background-image: radial-gradient(#d7dde5 1px, transparent 1px); background-size: 20px 20px;">

                                    <div class="flex h-[240px] w-[360px] items-center justify-center bg-[#17447f] text-white shadow-xl transition-all duration-200"
                                        :style="previewStyle">

                                        <div class="text-center">

                                            <p class="text-2xl font-bold">
                                                CSSCraft
                                            </p>

                                            <p class="mt-1 text-sm text-white/70">
                                                {{ shapeLabel }}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Properties -->
                        <div class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 sm:grid-cols-4">

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">

                                    Shape

                                </p>

                                <p class="mt-1 truncate text-xs font-semibold text-[#10233f] dark:text-slate-200">

                                    {{ shapeLabel }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">

                                    Property

                                </p>

                                <p class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">

                                    clip-path

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">

                                    Type

                                </p>

                                <p class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">

                                    CSS Shape

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">

                                    Status

                                </p>

                                <p class="mt-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">

                                    Active

                                </p>

                            </div>

                        </div>

                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-[#0f172a]">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">

                                    <Code2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                        Generated CSS

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">

                                        CSS generated from your clip path.

                                    </p>

                                </div>

                            </div>

                            <button type="button" @click="copyText(generatedCss, 'generated-css')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check v-if="copied === 'generated-css'" class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'generated-css' ? 'Copied' : 'Copy CSS' }}

                            </button>

                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                    </section>

                    <!-- Generated HTML -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-[#0f172a]">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">

                                    <FileCode2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                        Generated HTML

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">

                                        HTML structure for the preview.

                                    </p>

                                </div>

                            </div>

                            <button type="button" @click="copyText(generatedHtml, 'html')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check v-if="copied === 'html'" class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'html' ? 'Copied' : 'Copy HTML' }}

                            </button>

                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedHtml }}</code></pre>

                    </section>

                    <!-- Complete Code -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-[#0f172a]">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <FileCode2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                        Complete Code

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">

                                        Ready-to-use HTML and CSS.

                                    </p>

                                </div>

                            </div>

                            <button type="button" @click="copyText(completeCode, 'complete')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17447f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#123968]">

                                <Check v-if="copied === 'complete'" class="h-3.5 w-3.5" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'complete' ? 'Copied' : 'Copy Complete Code' }}

                            </button>

                        </div>

                        <pre
                            class="max-h-[500px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ completeCode }}</code></pre>

                    </section>

                </div>

            </div>

        </section>

    </main>
</template>