<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    Image,
    Palette,
    Plus,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
    Trash2,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('controls')

const settings = ref({
    type: 'linear',
    angle: 135,
    radialShape: 'circle',
    radialPosition: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#17447f',
    imageUrl: '',
})

const gradientStops = ref([
    {
        id: 1,
        color: '#17447f',
        position: 0,
    },
    {
        id: 2,
        color: '#38bdf8',
        position: 100,
    },
])

let nextStopId = 3

const defaultSettings = {
    type: 'linear',
    angle: 135,
    radialShape: 'circle',
    radialPosition: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#17447f',
    imageUrl: '',
}

const defaultStops = [
    {
        id: 1,
        color: '#17447f',
        position: 0,
    },
    {
        id: 2,
        color: '#38bdf8',
        position: 100,
    },
]

const gradientValue = computed(() => {
    const stops = [...gradientStops.value]
        .sort((a, b) => a.position - b.position)
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ')

    if (settings.value.type === 'radial') {
        return `radial-gradient(${settings.value.radialShape} at ${settings.value.radialPosition}, ${stops})`
    }

    return `linear-gradient(${settings.value.angle}deg, ${stops})`
})

const backgroundValue = computed(() => {
    if (settings.value.type === 'solid') {
        return settings.value.color
    }

    if (settings.value.type === 'image') {
        if (!settings.value.imageUrl.trim()) {
            return 'none'
        }

        return `url("${settings.value.imageUrl}")`
    }

    return gradientValue.value
})

const previewStyle = computed(() => {
    const style = {
        background: backgroundValue.value,
    }

    if (settings.value.type === 'image') {
        style.backgroundSize = settings.value.backgroundSize
        style.backgroundPosition = settings.value.backgroundPosition
        style.backgroundRepeat = settings.value.backgroundRepeat
    }

    return style
})

const generatedCss = computed(() => {
    let css = `.background-preview {\n`

    if (settings.value.type === 'image') {
        css += `    background-image: ${backgroundValue.value};\n`
        css += `    background-size: ${settings.value.backgroundSize};\n`
        css += `    background-position: ${settings.value.backgroundPosition};\n`
        css += `    background-repeat: ${settings.value.backgroundRepeat};\n`
    } else {
        css += `    background: ${backgroundValue.value};\n`
    }

    css += `}`

    return css
})

const generatedHtml = computed(() => {
    return `<div class="background-preview">
</div>`
})

const completeCode = computed(() => {
    let css = `.background-preview {
    width: 100%;
    height: 300px;
`

    if (settings.value.type === 'image') {
        css += `    background-image: ${backgroundValue.value};\n`
        css += `    background-size: ${settings.value.backgroundSize};\n`
        css += `    background-position: ${settings.value.backgroundPosition};\n`
        css += `    background-repeat: ${settings.value.backgroundRepeat};\n`
    } else {
        css += `    background: ${backgroundValue.value};\n`
    }

    css += `}`

    return `${generatedHtml.value}

<style>
${css}
</style>`
})

const addStop = () => {
    const lastStop = gradientStops.value[gradientStops.value.length - 1]

    gradientStops.value.push({
        id: nextStopId++,
        color: '#ffffff',
        position: Math.min(100, (lastStop?.position || 0) + 20),
    })
}

const removeStop = (id) => {
    if (gradientStops.value.length <= 2) {
        return
    }

    gradientStops.value = gradientStops.value.filter(
        (stop) => stop.id !== id
    )
}

const reset = () => {
    settings.value = {
        ...defaultSettings,
    }

    gradientStops.value = defaultStops.map((stop) => ({
        ...stop,
    }))

    nextStopId = 3
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
    link.download = 'background-generator.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}
</script>

<template>
    <main class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-[#0b1120] dark:text-slate-100">

        <!-- Header -->
        <section class="border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-[#0f172a]">
            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">

                <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-400">
                            <Sparkles class="h-3.5 w-3.5" />
                            CSS Builder
                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] transition-colors dark:text-slate-100 sm:text-4xl">
                            Background Generator
                        </h1>

                        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Create solid colors, gradients, and image backgrounds visually
                            and generate clean CSS instantly.
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
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-[#111827]">

                    <!-- Tabs -->
                    <div class="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800">

                        <button type="button" @click="activeTab = 'controls'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'controls'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                        ]">
                            <SlidersHorizontal class="h-3.5 w-3.5" />
                            Controls
                        </button>

                        <button type="button" @click="activeTab = 'css'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'css'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                        ]">
                            <Code2 class="h-3.5 w-3.5" />
                            CSS
                        </button>

                    </div>

                    <!-- Controls -->
                    <div v-if="activeTab === 'controls'" class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">
                                <Palette class="h-5 w-5" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">
                                    Background Settings
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    Build your background
                                </p>
                            </div>

                        </div>

                        <!-- Background Type -->
                        <div>
                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Background Type
                            </label>

                            <select v-model="settings.type"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                <option value="solid">Solid Color</option>
                                <option value="linear">Linear Gradient</option>
                                <option value="radial">Radial Gradient</option>
                                <option value="image">Image</option>

                            </select>
                        </div>

                        <!-- Solid -->
                        <div v-if="settings.type === 'solid'" class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Background Color
                            </label>

                            <div class="flex gap-2">

                                <input v-model="settings.color" type="color"
                                    class="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900" />

                                <input v-model="settings.color" type="text"
                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950" />

                            </div>

                        </div>

                        <!-- Gradient -->
                        <div v-if="settings.type === 'linear' || settings.type === 'radial'" class="mt-6">

                            <div class="mb-3 flex items-center justify-between">

                                <label
                                    class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Gradient Colors
                                </label>

                                <button type="button" @click="addStop"
                                    class="inline-flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-[11px] font-semibold text-[#167fa8] transition hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-400 dark:hover:bg-cyan-950/70">
                                    <Plus class="h-3.5 w-3.5" />
                                    Add
                                </button>

                            </div>

                            <div class="space-y-3">

                                <div v-for="(stop, index) in gradientStops" :key="stop.id"
                                    class="rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors dark:border-slate-700 dark:bg-slate-900">

                                    <div class="mb-2 flex items-center justify-between">

                                        <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Color {{ index + 1 }}
                                        </span>

                                        <button v-if="gradientStops.length > 2" type="button"
                                            @click="removeStop(stop.id)"
                                            class="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40">
                                            <Trash2 class="h-3.5 w-3.5" />
                                        </button>

                                    </div>

                                    <div class="flex gap-2">

                                        <input v-model="stop.color" type="color"
                                            class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800" />

                                        <input v-model="stop.color" type="text"
                                            class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-700 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-cyan-500" />

                                    </div>

                                    <div class="mt-3">

                                        <label
                                            class="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                            <span>Position</span>

                                            <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                                {{ stop.position }}%
                                            </span>

                                        </label>

                                        <input v-model.number="stop.position" type="range" min="0" max="100"
                                            class="w-full accent-cyan-500" />

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Linear Controls -->
                        <div v-if="settings.type === 'linear'" class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                <span>Angle</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.angle }}°
                                </span>

                            </label>

                            <input v-model.number="settings.angle" type="range" min="0" max="360"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Radial Controls -->
                        <div v-if="settings.type === 'radial'" class="mt-6 space-y-5">

                            <div>

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Shape
                                </label>

                                <select v-model="settings.radialShape"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500">

                                    <option value="circle">Circle</option>
                                    <option value="ellipse">Ellipse</option>

                                </select>

                            </div>

                            <div>

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Position
                                </label>

                                <select v-model="settings.radialPosition"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500">

                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="right">Right</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="top left">Top Left</option>
                                    <option value="top right">Top Right</option>
                                    <option value="bottom left">Bottom Left</option>
                                    <option value="bottom right">Bottom Right</option>

                                </select>

                            </div>

                        </div>

                        <!-- Image -->
                        <div v-if="settings.type === 'image'" class="mt-6">

                            <div
                                class="mb-6 flex items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50/60 p-3 dark:border-cyan-900/70 dark:bg-cyan-950/30">

                                <Image class="h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                <p class="text-xs leading-5 text-[#2b6b86] dark:text-cyan-300">
                                    Enter an image URL to use as the CSS background.
                                </p>

                            </div>

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Image URL
                            </label>

                            <input v-model="settings.imageUrl" type="text" placeholder="https://example.com/image.jpg"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-cyan-500 dark:focus:ring-cyan-950" />

                            <div class="mt-5 space-y-5">

                                <div>
                                    <label
                                        class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Background Size
                                    </label>

                                    <select v-model="settings.backgroundSize"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500">

                                        <option value="cover">Cover</option>
                                        <option value="contain">Contain</option>
                                        <option value="auto">Auto</option>
                                        <option value="100% 100%">Stretch</option>

                                    </select>
                                </div>

                                <div>
                                    <label
                                        class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Background Position
                                    </label>

                                    <select v-model="settings.backgroundPosition"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500">

                                        <option value="center">Center</option>
                                        <option value="top">Top</option>
                                        <option value="right">Right</option>
                                        <option value="bottom">Bottom</option>
                                        <option value="left">Left</option>

                                    </select>
                                </div>

                                <div>
                                    <label
                                        class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Background Repeat
                                    </label>

                                    <select v-model="settings.backgroundRepeat"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500">

                                        <option value="no-repeat">No Repeat</option>
                                        <option value="repeat">Repeat</option>
                                        <option value="repeat-x">Repeat X</option>
                                        <option value="repeat-y">Repeat Y</option>

                                    </select>
                                </div>

                            </div>

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
                                    CSS generated from your background
                                </p>
                            </div>

                        </div>

                        <pre
                            class="max-h-[500px] overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

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
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-[#111827]">

                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">
                                    <Palette class="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">
                                        Background Editor
                                    </h2>

                                    <p class="max-w-xl truncate text-xs text-slate-500 dark:text-slate-400">
                                        {{ backgroundValue }}
                                    </p>
                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">
                                    {{ settings.type === 'solid'
                                        ? 'Solid'
                                        : settings.type === 'image'
                                            ? 'Image'
                                            : settings.type === 'linear'
                                                ? 'Linear Gradient'
                                                : 'Radial Gradient' }}
                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">

                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500">
                                    </span>

                                    Live
                                </span>

                            </div>

                        </div>

                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 transition-colors dark:border-slate-800 dark:bg-[#0f172a] sm:p-10">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/70 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">
                                            Visual Background Editor
                                        </p>

                                        <p class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-300">
                                            Change the background type and its properties
                                            to see the preview update instantly.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">

                                <div class="flex min-h-[430px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 p-8 transition-colors dark:border-slate-700"
                                    style="background-image: radial-gradient(#d7dde5 1px, transparent 1px); background-size: 20px 20px;">

                                    <div class="flex h-[300px] w-full max-w-[700px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 shadow-xl transition-all duration-200 dark:border-slate-700"
                                        :style="previewStyle">

                                        <div class="rounded-2xl bg-black/20 px-8 py-6 text-center backdrop-blur-sm">

                                            <p class="text-2xl font-bold text-white">
                                                CSSCraft
                                            </p>

                                            <p class="mt-1 text-sm text-white/75">
                                                Background Generator
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Properties -->
                        <div class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 sm:grid-cols-4">

                            <div class="p-4">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Type
                                </p>

                                <p class="mt-1 truncate text-xs font-semibold text-[#10233f] dark:text-slate-200">
                                    {{ settings.type }}
                                </p>

                            </div>

                            <div class="p-4">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Colors
                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">
                                    {{ gradientStops.length }}
                                </p>

                            </div>

                            <div class="p-4">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Angle
                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">
                                    {{ settings.type === 'linear'
                                        ? `${settings.angle}°`
                                        : '—' }}
                                </p>

                            </div>

                            <div class="p-4">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    CSS
                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">
                                    background
                                </p>

                            </div>

                        </div>

                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-[#111827]">

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
                                        Ready-to-use background CSS.
                                    </p>

                                </div>

                            </div>

                            <button type="button" @click="copyText(generatedCss, 'generated-css')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check v-if="copied === 'generated-css'" class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{
                                    copied === 'generated-css'
                                        ? 'Copied'
                                        : 'Copy CSS'
                                }}

                            </button>

                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                    </section>

                    <!-- Generated HTML -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-[#111827]">

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
                                        HTML structure for the background.
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
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedHtml }}</code></pre>

                    </section>

                    <!-- Complete Code -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-[#111827]">

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

                                {{
                                    copied === 'complete'
                                        ? 'Copied'
                                        : 'Copy Complete Code'
                                }}

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