<script setup>
import { computed, ref, watch } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    Palette,
    RotateCcw,
    Sparkles,
    Pipette,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('color')

const color = ref('#17447F')
const opacity = ref(1)

const defaultColor = '#17447F'
const defaultOpacity = 1

const hexInput = ref('#17447F')

const savedColors = ref([
    '#17447F',
    '#167FA8',
    '#0F2F59',
    '#22C55E',
])

const hexToRgb = (hex) => {
    let value = hex.replace('#', '').trim()

    if (value.length === 3) {
        value = value
            .split('')
            .map((char) => char + char)
            .join('')
    }

    if (!/^[0-9A-Fa-f]{6}$/.test(value)) {
        return {
            r: 23,
            g: 68,
            b: 127,
        }
    }

    return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16),
    }
}

const rgbToHex = (r, g, b) => {
    const toHex = (value) => {
        return Math.max(0, Math.min(255, Math.round(value)))
            .toString(16)
            .padStart(2, '0')
            .toUpperCase()
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const rgb = computed(() => hexToRgb(color.value))

const rgbValue = computed(() => {
    return `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`
})

const rgbaValue = computed(() => {
    return `rgba(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}, ${opacity.value.toFixed(2)})`
})

const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min)

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6
                break
            case g:
                h = ((b - r) / d + 2) / 6
                break
            case b:
                h = ((r - g) / d + 4) / 6
                break
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    }
}

const hsl = computed(() => {
    return rgbToHsl(
        rgb.value.r,
        rgb.value.g,
        rgb.value.b
    )
})

const hslValue = computed(() => {
    return `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`
})

const hslaValue = computed(() => {
    return `hsla(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%, ${opacity.value.toFixed(2)})`
})

const previewStyle = computed(() => ({
    backgroundColor: rgbaValue.value,
}))

const generatedCss = computed(() => {
    return `.color-preview {
    color: ${rgbaValue.value};
    background-color: ${rgbaValue.value};
}`
})

const generatedHtml = computed(() => {
    return `<div class="color-preview">
    CSSCraft
</div>`
})

const completeCode = computed(() => {
    return `${generatedHtml.value}

<style>
.color-preview {
    color: ${rgbaValue.value};
    background-color: ${rgbaValue.value};
}
</style>`
})

const updateFromHex = () => {
    let value = hexInput.value.trim()

    if (!value.startsWith('#')) {
        value = `#${value}`
    }

    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        color.value = value.toUpperCase()
        hexInput.value = color.value
    }
}

const updateRgb = (channel, value) => {
    const next = {
        ...rgb.value,
        [channel]: Number(value),
    }

    color.value = rgbToHex(
        next.r,
        next.g,
        next.b
    )

    hexInput.value = color.value
}

const selectColor = (value) => {
    color.value = value
    hexInput.value = value
}

const saveColor = () => {
    if (!savedColors.value.includes(color.value)) {
        savedColors.value.unshift(color.value)
    }
}

const removeColor = (value) => {
    savedColors.value = savedColors.value.filter(
        (item) => item !== value
    )
}

const reset = () => {
    color.value = defaultColor
    hexInput.value = defaultColor
    opacity.value = defaultOpacity
    activeTab.value = 'color'
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
    const blob = new Blob(
        [completeCode.value],
        {
            type: 'text/html;charset=utf-8',
        }
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'color-generator.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}

watch(color, (value) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        hexInput.value = value.toUpperCase()
    }
})
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors duration-200 dark:bg-[#0b1120] dark:text-slate-100">

        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-[#0f172a]">
            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">

                <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-400">
                            <Sparkles class="h-3.5 w-3.5" />
                            CSS Builder
                        </div>

                        <h1 class="text-3xl font-bold tracking-tight text-[#10233f] sm:text-4xl dark:text-slate-100">
                            Color Generator
                        </h1>

                        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Create, customize, convert, and copy CSS colors with live visual feedback.
                        </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">

                        <button type="button" @click="reset"
                            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800">
                            <RotateCcw class="h-4 w-4" />
                            Reset
                        </button>

                        <button type="button" @click="exportHtml"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123968]">
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
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#0f172a]">

                    <!-- Tabs -->
                    <div class="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800">

                        <button type="button" @click="activeTab = 'color'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'color'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                        ]">
                            <Palette class="h-3.5 w-3.5" />
                            Color
                        </button>

                        <button type="button" @click="activeTab = 'palette'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'palette'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                        ]">
                            <Pipette class="h-3.5 w-3.5" />
                            Palette
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

                    <!-- Color Controls -->
                    <div v-if="activeTab === 'color'" class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">
                                <Palette class="h-5 w-5" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">
                                    Color Settings
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    Customize your color
                                </p>
                            </div>

                        </div>

                        <!-- Color Picker -->
                        <div>

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Color
                            </label>

                            <input v-model="color" type="color"
                                class="h-32 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900" />

                        </div>

                        <!-- HEX -->
                        <div class="mt-5">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                HEX
                            </label>

                            <input v-model="hexInput" @change="updateFromHex" @keyup.enter="updateFromHex" type="text"
                                maxlength="7"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-700 uppercase outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950" />

                        </div>

                        <!-- RGB -->
                        <div class="mt-6">

                            <div class="mb-3 flex items-center justify-between">

                                <label
                                    class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    RGB
                                </label>

                                <span class="font-mono text-xs text-[#167fa8] dark:text-cyan-400">
                                    {{ rgbValue }}
                                </span>

                            </div>

                            <div class="space-y-4">

                                <div>
                                    <div
                                        class="mb-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                        <span>Red</span>
                                        <span>{{ rgb.r }}</span>
                                    </div>

                                    <input :value="rgb.r" @input="updateRgb('r', $event.target.value)" type="range"
                                        min="0" max="255" class="w-full accent-cyan-500" />
                                </div>

                                <div>
                                    <div
                                        class="mb-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                        <span>Green</span>
                                        <span>{{ rgb.g }}</span>
                                    </div>

                                    <input :value="rgb.g" @input="updateRgb('g', $event.target.value)" type="range"
                                        min="0" max="255" class="w-full accent-cyan-500" />
                                </div>

                                <div>
                                    <div
                                        class="mb-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                        <span>Blue</span>
                                        <span>{{ rgb.b }}</span>
                                    </div>

                                    <input :value="rgb.b" @input="updateRgb('b', $event.target.value)" type="range"
                                        min="0" max="255" class="w-full accent-cyan-500" />
                                </div>

                            </div>
                        </div>

                        <!-- Opacity -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <span>Opacity</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ opacity.toFixed(2) }}
                                </span>
                            </label>

                            <input v-model.number="opacity" type="range" min="0" max="1" step="0.01"
                                class="w-full accent-cyan-500" />

                        </div>

                    </div>

                    <!-- Palette -->
                    <div v-else-if="activeTab === 'palette'" class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">
                                <Pipette class="h-5 w-5" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">
                                    Saved Colors
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    Build your own palette
                                </p>
                            </div>

                        </div>

                        <button type="button" @click="saveColor"
                            class="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968]">
                            <Palette class="h-4 w-4" />
                            Save Current Color
                        </button>

                        <div class="grid grid-cols-2 gap-3">

                            <div v-for="item in savedColors" :key="item"
                                class="group overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">

                                <button type="button" @click="selectColor(item)" class="h-20 w-full"
                                    :style="{ backgroundColor: item }"></button>

                                <div class="flex items-center justify-between px-2.5 py-2">

                                    <button type="button" @click="selectColor(item)"
                                        class="font-mono text-[10px] font-medium text-slate-600 dark:text-slate-300">
                                        {{ item }}
                                    </button>

                                    <button type="button" @click="removeColor(item)"
                                        class="text-[10px] text-slate-400 transition hover:text-red-500">
                                        ×
                                    </button>

                                </div>
                            </div>

                        </div>

                    </div>

                    <!-- CSS -->
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
                                    Ready-to-use color CSS
                                </p>
                            </div>

                        </div>

                        <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

                            <pre
                                class="max-h-[500px] overflow-auto bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                        </div>

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
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#0f172a]">

                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">
                                    <Palette class="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">
                                        Color Preview
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        {{ rgbaValue }}
                                    </p>
                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">
                                    Color
                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
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

                                    <Palette class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>
                                        <p class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">
                                            Visual Color Editor
                                        </p>

                                        <p class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-200/70">
                                            Change the color, RGB channels, or opacity to see the preview update
                                            instantly.
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">

                                <div class="flex min-h-[430px] w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 p-8 dark:border-slate-700"
                                    style="background-image: radial-gradient(#d7dde5 1px, transparent 1px); background-size: 20px 20px;">

                                    <div class="flex min-h-[330px] w-full items-center justify-center rounded-lg border border-slate-200 p-10 transition-all duration-200 dark:border-slate-700"
                                        :style="previewStyle">

                                        <div class="text-center text-white drop-shadow-md">

                                            <p class="text-4xl font-bold sm:text-6xl">
                                                CSSCraft
                                            </p>

                                            <p class="mt-3 text-sm text-white/80">
                                                {{ rgbaValue }}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Properties -->
                        <div class="grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4 dark:divide-slate-800">

                            <div class="p-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    HEX
                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">
                                    {{ color }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    RGB
                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">
                                    {{ rgbValue }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    HSL
                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">
                                    {{ hslValue }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Opacity
                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">
                                    {{ opacity.toFixed(2) }}
                                </p>
                            </div>

                        </div>

                    </section>

                    <!-- Color Values -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#0f172a]">

                        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <Palette class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-slate-100">
                                        Color Formats
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Copy the color in your preferred CSS format.
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div class="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4 dark:bg-slate-800">

                            <div class="bg-white p-5 dark:bg-[#0f172a]">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    HEX
                                </p>

                                <div class="mt-2 flex items-center gap-2">

                                    <code
                                        class="min-w-0 flex-1 truncate font-mono text-xs text-[#10233f] dark:text-slate-200">
                                        {{ color }}
                                    </code>

                                    <button type="button" @click="copyText(color, 'hex')"
                                        class="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400">
                                        <Check v-if="copied === 'hex'" class="h-3.5 w-3.5 text-emerald-500" />

                                        <Copy v-else class="h-3.5 w-3.5" />
                                    </button>

                                </div>

                            </div>

                            <div class="bg-white p-5 dark:bg-[#0f172a]">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    RGB
                                </p>

                                <div class="mt-2 flex items-center gap-2">

                                    <code
                                        class="min-w-0 flex-1 truncate font-mono text-xs text-[#10233f] dark:text-slate-200">
                                        {{ rgbValue }}
                                    </code>

                                    <button type="button" @click="copyText(rgbValue, 'rgb')"
                                        class="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400">
                                        <Check v-if="copied === 'rgb'" class="h-3.5 w-3.5 text-emerald-500" />

                                        <Copy v-else class="h-3.5 w-3.5" />
                                    </button>

                                </div>

                            </div>

                            <div class="bg-white p-5 dark:bg-[#0f172a]">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    RGBA
                                </p>

                                <div class="mt-2 flex items-center gap-2">

                                    <code
                                        class="min-w-0 flex-1 truncate font-mono text-xs text-[#10233f] dark:text-slate-200">
                                        {{ rgbaValue }}
                                    </code>

                                    <button type="button" @click="copyText(rgbaValue, 'rgba')"
                                        class="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400">
                                        <Check v-if="copied === 'rgba'" class="h-3.5 w-3.5 text-emerald-500" />

                                        <Copy v-else class="h-3.5 w-3.5" />
                                    </button>

                                </div>

                            </div>

                            <div class="bg-white p-5 dark:bg-[#0f172a]">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    HSL
                                </p>

                                <div class="mt-2 flex items-center gap-2">

                                    <code
                                        class="min-w-0 flex-1 truncate font-mono text-xs text-[#10233f] dark:text-slate-200">
                                        {{ hslValue }}
                                    </code>

                                    <button type="button" @click="copyText(hslValue, 'hsl')"
                                        class="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400">
                                        <Check v-if="copied === 'hsl'" class="h-3.5 w-3.5 text-emerald-500" />

                                        <Copy v-else class="h-3.5 w-3.5" />
                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#0f172a]">

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
                                        CSS generated from your selected color.
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
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                    </section>

                    <!-- Generated HTML -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#0f172a]">

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
                                        HTML structure generated from your editor.
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
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#0f172a]">

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